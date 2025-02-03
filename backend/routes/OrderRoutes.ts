import express from 'express'; // express 모듈을 임포트합니다.
import OrderController from "../feature/orders/controller/OrderController"; // OrderController 모듈을 임포트합니다.

const router = express.Router(); // express.Router()를 사용하여 라우터를 생성합니다.

router.get('/UserPoints', OrderController.getUserPoints); // GET 요청을 처리하기 위해 /UserPoints 경로와 OrderController의 getUserPoints 함수를 연결합니다.
router.get('/DeliveryMessage', OrderController.getDeliveryMessage);
router.get('/UserAddress', OrderController.getUserAddress);
router.get('/OrderProducts', OrderController.getOrderProducts);
export default router; // 생성한 라우터를 내보내기 합니다.
