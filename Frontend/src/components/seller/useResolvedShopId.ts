import { useEffect, useState } from "react";
import { getUserFromStorage } from "../../services/authService";
import { getShopByOwnerId } from "../../services/shopService";

export function useResolvedShopId(initialShopId: number) {
  const [shopId, setShopId] = useState(initialShopId);
  const [isResolving, setIsResolving] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const resolveShopId = async () => {
      const user = getUserFromStorage();

      if (!user?.userId) {
        if (isMounted) {
          setShopId(initialShopId);
          setIsResolving(false);
        }
        return;
      }

      try {
        const response = await getShopByOwnerId(user.userId);

        if (!isMounted) {
          return;
        }

        if (response.resultCd === 0 && response.data?.shopId) {
          setShopId(response.data.shopId);
        } else {
          setShopId(initialShopId);
        }
      } catch (error) {
        console.error("Failed to resolve seller shop id", error);
        if (isMounted) {
          setShopId(initialShopId);
        }
      } finally {
        if (isMounted) {
          setIsResolving(false);
        }
      }
    };

    resolveShopId();

    return () => {
      isMounted = false;
    };
  }, [initialShopId]);

  return { shopId, isResolving };
}
