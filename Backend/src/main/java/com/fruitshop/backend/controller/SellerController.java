@RestController
@RequestMapping("/api/seller")
@RequiredArgsConstructor
public class SellerController {

    private final OrderService orderService;

    /**
     * Use Case: View Sale Report
     * Lấy dữ liệu tổng quan về tình hình kinh doanh của Shop
     */
    @GetMapping("/reports/{shopId}")
    public ResponseEntity<SalesReportDto> getSalesReport(@PathVariable Integer shopId) {
        return ResponseEntity.ok(orderService.getShopSalesReport(shopId));
    }
}