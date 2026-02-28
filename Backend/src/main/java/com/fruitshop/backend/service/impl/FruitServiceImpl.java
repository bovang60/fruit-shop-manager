@Service
@RequiredArgsConstructor
@Transactional
public class FruitServiceImpl implements FruitService {
    private final FruitRepository fruitRepository;
    private final ShopRepository shopRepository;

    @Override
    public FruitResponseDto createFruit(FruitRequestDto fruitDto, Integer userId) {
        Shop shop = shopRepository.findByOwnerUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Shop not found for this seller"));

        Fruit fruit = new Fruit();
        // Map DTO to Entity
        fruit.setFruitName(fruitDto.getFruitName());
        fruit.setShop(shop);
        // ... các fields khác

        Fruit savedFruit = fruitRepository.save(fruit);
        return mapToResponseDto(savedFruit);
    }

    @Override
    public void deleteFruit(Integer fruitId, Integer userId) {
        Fruit fruit = fruitRepository.findById(fruitId)
                .orElseThrow(() -> new ResourceNotFoundException("Fruit not found"));

        // Kiểm tra quyền sở hữu: Chỉ chủ Shop mới được xóa sản phẩm của Shop đó
        if (!fruit.getShop().getOwner().getUserId().equals(userId)) {
            throw new UnauthorizedException("You don't have permission to delete this fruit");
        }

        // Nên dùng Soft Delete (đổi status) để tránh lỗi vãng lai với Order cũ
        fruit.setStatus(FruitStatus.HIDDEN);
        fruitRepository.save(fruit);
    }
}