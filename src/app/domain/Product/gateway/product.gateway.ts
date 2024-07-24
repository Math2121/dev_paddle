import { injectable } from "inversify";
import { instanceOfAxios } from "../../../../infrastructure/library/axios";
import { RouterException } from "../../../../utils/customExceptions";
import { ApiProductGatewayInterface } from "./interface/api.product.gateway.interface";
@injectable()
export class ApiProductGateway implements ApiProductGatewayInterface {
    async fetchPrices(): Promise<any> {
        try {
            const prices = await instanceOfAxios.get('prices');
            return prices.data.data;
        } catch (error:any) {
            throw new RouterException(error)
        }
    }

}