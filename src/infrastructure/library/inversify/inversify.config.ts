
import { Container } from "inversify";
import { CustomerServiceInterface } from "../../../app/domain/Customer/interfaces/CustomerServiceInterface";
import { CustomerService } from "../../../app/domain/Customer/service";
import { TYPES } from "./types";
import { CustomerRepositoryInterface } from "../../../app/domain/Customer/interfaces/CustomerRepositoryInterface";
import { CustomerRepository } from "../../../app/domain/Customer/repository/prisma/repository";
import { Customer as CustomerPrisma, Payment, Price, Subscription } from "@prisma/client";

import { SubscriptionServiceInterface } from "../../../app/domain/Subscription/interfaces/SubscriptionServiceInterface";
import { SubscriptionService } from "../../../app/domain/Subscription/service";

import { Observer } from "../../../app/observers/interface/IObserver";
import { CustomerObserver } from "../../../app/observers/CustomerObserver";
import { SubscriptionRepositoryInterface } from "../../../app/domain/Subscription/interfaces/SubscriptionRepositoryInterface";
import { SubscriptionRepository } from "../../../app/domain/Subscription/repository/prisma/SubscriptionRepository";

import { SubscriptionObserver } from "../../../app/observers/SubscriptionObserver";
import PriceRepository from "../../../app/domain/Price/repository/prisma/repository";
import PriceRepositoryInterface from "../../../app/domain/Price/repository/interface/price.interface";
import { PriceServiceInterface } from "../../../app/domain/Price/interface/service.interface";
import PriceService from "../../../app/domain/Price/service";
import { PriceObserver } from "../../../app/observers/PriceObserver";
import { ProductRepositoryInterface } from "../../../app/domain/Product/interfaces/ProductRepositoryInterface";
import ProductRepository from "../../../app/domain/Product/repository/prisma/product.repository";
import { ProductServiceInterface } from "../../../app/domain/Product/interfaces/ProductServiceInterface";
import ProductService from "../../../app/domain/Product/service";
import { ApiCustomerGatewayInterface } from "../../../app/domain/Customer/gateway/interface/api.customer.gateway.interface";
import { ApiCustomerGateway } from "../../../app/domain/Customer/gateway/api.customer.gateway";
import { ApiSubscriptionGateway } from "../../../app/domain/Subscription/gateway/api.subscription.gateway";
import { ApiSubscriptionGatewayInterface } from "../../../app/domain/Subscription/gateway/interface/api.subscription.gateway.interface";

import { DatabaseConnection } from "../../database/interface/database_connection.interface";
import { CreditObserver } from "../../../app/observers/CreditObserver";
import { CreditsService } from "../../../app/domain/Credits/service";
import { CreditsServiceInterface } from "../../../app/domain/Credits/interface/credits.service.interface";
import { CreditsRepositoryInterface } from "../../../app/domain/Credits/repository/interface/credits.repository.interface";
import { CreditsRepository } from "../../../app/domain/Credits/repository/mysql/credits.repository";
import { ApiCredit } from "../../../app/domain/Credits/gateway/apiCredit";
import { ApiCreditsGatewayInterface } from "../../../app/domain/Credits/interface/api.credits.gateway";
import { MySqlConnection } from "../../database/mysql/instanceOfMysql";
import { ApiProductGatewayInterface } from "../../../app/domain/Product/gateway/interface/api.product.gateway.interface";
import { ApiProductGateway } from "../../../app/domain/Product/gateway/product.gateway";
import { PaymentRepositoryInterface, PaymentServiceInterface } from "../../../app/domain/Payment/interface/payment.interface";
import PaymentRepository from "../../../app/domain/Payment/repository/prisma/payment.repository";
import { PaymentService } from "../../../app/domain/Payment/service";

const container = new Container();

container.bind<CustomerServiceInterface>(TYPES.CustomerServiceInterface).to(CustomerService)


container.bind<CustomerRepositoryInterface<CustomerPrisma>>(TYPES.CustomerRepositoryInterface).to(CustomerRepository)

container.bind<ApiCustomerGatewayInterface>(TYPES.ApiServiceInterface).to(ApiCustomerGateway)
container.bind<ApiCreditsGatewayInterface>(TYPES.ApiCreditsInterface).to(ApiCredit)
container.bind<Observer>('Observer').to(CustomerObserver)
container.bind<Observer>('ObserverSubscription').to(SubscriptionObserver)
container.bind<Observer>('PriceObserver').to(PriceObserver)
container.bind<Observer>('CreditObserver').to(CreditObserver)
container.bind<SubscriptionRepositoryInterface<Subscription>>(TYPES.SubscriptionRepositoryInterface).to(SubscriptionRepository)

container.bind<SubscriptionServiceInterface>(TYPES.SubscriptionServiceInterface).to(SubscriptionService)
container.bind<PriceRepositoryInterface<Price>>(TYPES.PriceRepositoryInterface).to(PriceRepository)

container.bind<PriceServiceInterface>(TYPES.PriceServiceInterface).to(PriceService)

container.bind<ProductRepositoryInterface>(TYPES.ProductRepositoryInterface).to(ProductRepository)

container.bind<ProductServiceInterface>(TYPES.ProductServiceInterface).to(ProductService)
container.bind<ApiSubscriptionGatewayInterface>(TYPES.ApiSubscriptionInterface).to(ApiSubscriptionGateway)


container.bind<DatabaseConnection>(TYPES.MySqlConnection).to(MySqlConnection)

container.bind<CreditsServiceInterface>(TYPES.CreditsServiceInterface).to(CreditsService)

container.bind<CreditsRepositoryInterface>(TYPES.CreditsRepositoryInterface).to(CreditsRepository)
container.bind<ApiProductGatewayInterface>(TYPES.ApiProductGatewayInterface).to(ApiProductGateway)

container.bind<PaymentRepositoryInterface<Payment>>(TYPES.PaymentRepository).to(PaymentRepository)
container.bind<PaymentServiceInterface>(TYPES.PaymentService).to(PaymentService)
export { container };