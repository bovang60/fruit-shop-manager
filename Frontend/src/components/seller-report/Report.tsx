import { useEffect, useState } from "react";
import ReportView from "./ReportView";
import { callApiWithMethod, type ApiResponse } from "../../utils/apiClient";
import type { SalesReportApiModel } from "../../services/sellerDashboardService";
import {
    getSellerOrdersByShop,
    type OrderStatus,
    type SellerOrderDto,
} from "../../services/sellerOrderService";

export type MonthlyReportPoint = {
    label: string;
    orders: number;
    revenue: number;
};

export type ReportSummary = {
    totalOrders: number;
    successfulOrders: number;
    totalRevenue: number;
    totalFruitsSold: number;
    monthLabel: string;
};

function normalizeApiResponse<T>(response: ApiResponse<T> | T): ApiResponse<T> {
    if (response && typeof response === "object" && "resultCd" in response) {
        return response as ApiResponse<T>;
    }
    return {
        resultCd: 0,
        message: "Success",
        data: response as T,
    };
}

const Report = ({ shopId }: { shopId: number }) => {
    const [reportData, setReportData] = useState<ReportSummary | null>(null);
    const [monthlyData, setMonthlyData] = useState<MonthlyReportPoint[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!shopId) {
            setLoading(false);
            return;
        }

        const fetchReport = async () => {
            setLoading(true);
            try {
                const [response, ordersResponse] = await Promise.all([
                    callApiWithMethod<never, ApiResponse<SalesReportApiModel> | SalesReportApiModel>(
                        "GET",
                        `/api/seller/reports/${shopId}`,
                    ),
                    getSellerOrdersByShop(shopId, "ALL"),
                ]);
                const normalized = normalizeApiResponse<SalesReportApiModel>(response);

                if (ordersResponse.resultCd === 0 && ordersResponse.data) {
                    setReportData(
                        buildCurrentMonthSummary(
                            ordersResponse.data,
                            normalized.resultCd === 0 ? normalized.data ?? null : null,
                        ),
                    );
                    setMonthlyData(buildMonthlyReportData(ordersResponse.data));
                } else {
                    setReportData(
                        buildCurrentMonthSummary(
                            [],
                            normalized.resultCd === 0 ? normalized.data ?? null : null,
                        ),
                    );
                    setMonthlyData(buildMonthlyReportData([]));
                }
            } catch (error) {
                console.error("Failed to fetch seller report:", error);
                setReportData(null);
                setMonthlyData(buildMonthlyReportData([]));
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, [shopId]);

    return <ReportView data={reportData} monthlyData={monthlyData} isLoading={loading} />;
};

export default Report;

function buildCurrentMonthSummary(
    orders: SellerOrderDto[],
    fallbackReport: SalesReportApiModel | null,
): ReportSummary {
    const now = new Date();
    const monthOrders = orders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return (
            !Number.isNaN(orderDate.getTime()) &&
            orderDate.getMonth() === now.getMonth() &&
            orderDate.getFullYear() === now.getFullYear()
        );
    });
    const completedMonthOrders = monthOrders.filter(
        (order) => order.status === "COMPLETED",
    );

    return {
        totalOrders: completedMonthOrders.length,
        successfulOrders: completedMonthOrders.length,
        totalRevenue: completedMonthOrders
            .reduce((sum, order) => sum + order.totalAmount, 0),
        totalFruitsSold: fallbackReport?.totalFruitsSold ?? 0,
        monthLabel: new Intl.DateTimeFormat("vi-VN", {
            month: "long",
            year: "numeric",
        }).format(now),
    };
}

function buildMonthlyReportData(
    orders: Array<{ createdAt: string; totalAmount: number; status?: OrderStatus }>,
): MonthlyReportPoint[] {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat("vi-VN", { month: "short" });

    const months = Array.from({ length: 12 }, (_, index) => {
        const date = new Date(now.getFullYear(), now.getMonth() - (11 - index), 1);
        return {
            key: `${date.getFullYear()}-${date.getMonth()}`,
            label: formatter.format(date).replace(".", ""),
            orders: 0,
            revenue: 0,
        };
    });

    const monthMap = new Map(months.map((month) => [month.key, month]));

    orders.forEach((order) => {
        const orderDate = new Date(order.createdAt);
        if (Number.isNaN(orderDate.getTime())) {
            return;
        }

        const key = `${orderDate.getFullYear()}-${orderDate.getMonth()}`;
        const month = monthMap.get(key);
        if (!month) {
            return;
        }

        if (order.status === "COMPLETED") {
            month.orders += 1;
            month.revenue += Number(order.totalAmount) || 0;
        }
    });

    return months;
}
