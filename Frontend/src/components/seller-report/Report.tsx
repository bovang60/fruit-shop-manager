import React, { useEffect, useState } from "react";
import ReportView from "./ReportView";
import { callApiWithMethod, type ApiResponse } from "../../utils/apiClient";
import type { SalesReportApiModel } from "../../services/sellerDashboardService";

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
    const [reportData, setReportData] = useState<SalesReportApiModel | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!shopId) {
            setLoading(false);
            return;
        }

        const fetchReport = async () => {
            setLoading(true);
            try {
                const response =
                    await callApiWithMethod<never, ApiResponse<SalesReportApiModel> | SalesReportApiModel>(
                        "GET",
                        `/api/seller/reports/${shopId}`,
                    );
                const normalized = normalizeApiResponse<SalesReportApiModel>(response);
                if (normalized.resultCd === 0 && normalized.data) {
                    setReportData(normalized.data);
                } else {
                    setReportData(null);
                }
            } catch (error) {
                console.error("Failed to fetch seller report:", error);
                setReportData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, [shopId]);

    return <ReportView data={reportData} isLoading={loading} />;
};

export default Report;
