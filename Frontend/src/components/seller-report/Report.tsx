import { useEffect, useState } from 'react';
import ReportView from './ReportView';

type ReportData = {
    totalOrders: number;
    successfulOrders: number;
    totalRevenue: string;
    totalFruitsSold: number;
};

const Report = ({ shopId }: { shopId: number }) => {
    const [reportData, setReportData] = useState<ReportData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Giả lập gọi API GET /api/seller/reports/{shopId}
        const fetchReport = async () => {
            try {
                // const res = await axios.get(`/api/seller/reports/${shopId}`);
                // setReportData(res.data);

                // Mock data theo SalesReportDto bên Backend
                setReportData({
                    totalOrders: 150,
                    successfulOrders: 142,
                    totalRevenue: "45.000.000",
                    totalFruitsSold: 850
                });
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, [shopId]);

    return <ReportView data={reportData} isLoading={loading} />;
};

export default Report;
