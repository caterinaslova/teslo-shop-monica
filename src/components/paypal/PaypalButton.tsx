"use client";

import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { CreateOrderData, CreateOrderActions, OnApproveData, OnApproveActions } from "@paypal/paypal-js";
import { paypalCheckPayment, setTransactionId } from "@/actions";

interface Props{
  orderId:string;
  amount:number;
}

export const PaypalButton = ({orderId , amount}:Props) => {
  const [{ isPending }] = usePayPalScriptReducer();
  const roundedAmount= (Math.round((amount*100)/100))

  if (isPending) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-300 rounded" />
        <div className="h-10 bg-gray-300 rounded mt-2" />
      </div>
    );
  }

  const createOrder = async (
    data: CreateOrderData,
    actions: CreateOrderActions
  ): Promise<string> => {
    const transactionId = await actions.order.create({
      purchase_units: [
        {
          invoice_id: orderId,
          amount: {
            currency_code: 'USD',
            value: `${roundedAmount}`,
          }
        }
      ],
      intent: "CAPTURE"
    });



   // Guardar la transaccion en la base de datos
   //actions/payments/setTransactionsId
   const { ok } = await setTransactionId( orderId, transactionId );
   if(!ok){
    throw new Error("No se pudo actualizar la orden")
   }

    return transactionId;
  };

  // Si se aprueba el pago

  const onApprove = async (data:OnApproveData, actions:OnApproveActions)=>{

    const details = await actions.order?.capture();
    if(!details)return;

    await paypalCheckPayment(details.id!);
  }

  return (
    <div className="relative z-0">
        <PayPalButtons 
          createOrder={createOrder}
          onApprove={onApprove}
        />

    </div>
);
};
