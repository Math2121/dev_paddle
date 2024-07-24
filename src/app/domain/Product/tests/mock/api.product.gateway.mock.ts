import { ApiProductGatewayInterface } from "../../gateway/interface/api.product.gateway.interface";
import { ApiProductGateway } from "../../gateway/product.gateway"

export default class MockApiProductGateway implements ApiProductGatewayInterface{
    fetchPrices(): Promise<any> {
        throw new Error("Method not implemented.");
    }

}