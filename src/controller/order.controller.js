const fs = require("fs");

const orderService = require("../service/order.service");
const globalService = require("../service/global.service");
class OrderController {
  async create(ctx, next) {
    const order = ctx.request.body;
    const { user_id } = ctx.user;
   
    const result = await orderService.create(order, user_id);

    ctx.body = result;
  }

  async all(ctx, next) {
    const result = await orderService.getAllOrders();

    ctx.body = result;
  }

  async detail(ctx, next) {
    const { order_id } = ctx.params;
    const result = await orderService.getOrderById(order_id);

    ctx.body = result;
  }

  async type(ctx, next) {
    const { typeId } = ctx.params;
    // console.log(typeId);
    const result = await orderService.getOrderByType(typeId);

    ctx.body = result;
  }

  async takeOrder(ctx, next) {
    const { order_id } = ctx.params;
    const { user_id } = ctx.user;
    const ifTake = await orderService.ifTake(order_id, user_id);
    var result;
    if (!ifTake || ifTake == [] || ifTake == "" || ifTake == null) {
       result = await orderService.takeOrder(order_id, user_id);
    } else {
       result = false;
    }

    ctx.body = result;
  }

  async takers(ctx, next) {
    const { order_id } = ctx.params;
    const result = await orderService.checkTakers(order_id);

    ctx.body = result;
  }

  async decide(ctx, next) {
    const { order_id, taker_id } = ctx.request.body;
    // console.log(order_id, taker_id);
    const result = await orderService.decideTaker(order_id, taker_id);

    ctx.body = order_id;
  }

  async collect(ctx, next) {
    const { order_id } =  ctx.request.body;
    const { user_id } = ctx.user;
    var result = "";
    const ifcollect = await globalService.ifCollect(1, order_id, user_id);
    // console.log("if:", ifcollect);
    if (!ifcollect || ifcollect == "" || ifcollect == undefined) {
      result = await globalService.collect(1, order_id, user_id);
      console.log(result)
    } else {
      result = false;
    }
    ctx.body = result;
  }

  async myTake(ctx, next) {
    const { user_id } = ctx.user;

    const result = await orderService.getMyTakeOrders(user_id);

    ctx.body = result;
  }

  async myPost(ctx, next) {
    const { user_id } = ctx.user;

    const result = await orderService.getMyPost(user_id);

    ctx.body = result;
  }

  async myPostDetail(ctx, next) {
    const { order_id } = ctx.params;
    const result = await orderService.getMyPostDetail(order_id);

    ctx.body = result;
  }
  async mySuccessTake(ctx, next) {
    const { order_id } = ctx.params;
    const result = await orderService.getMySuccessTake(order_id);

    ctx.body = result;
  }

  async deleteOrder(ctx, next) {
    const { order_id } = ctx.params;
    const result = await orderService.deleteOrder(order_id);

    ctx.body = result;
  }

  async cancelTake(ctx, next) {
    const { order_id } = ctx.params;
    const { user_id } = ctx.user;
    const result = await orderService.cancelTake(order_id, user_id);

    ctx.body = result;
  }
}

module.exports = new OrderController();
