import { Request, Response } from "express";
import { Endpoint, RequestType } from "firebase-backend";

export default new Endpoint(
  "addPaymentMethod",
  RequestType.POST,
  async (req: Request, res: Response) => {
    const cardNumber: string = req.body["card_number"];
    const cardHolder: string = req.body["card_holder"];

    let paymentToken = `${cardNumber}_${cardHolder}`;

    res.status(201).send({ token: paymentToken });
  }
);
