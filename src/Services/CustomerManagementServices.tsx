import axios from "axios";
import { CUSTOMER_MANAGEMENT_URL, TRANSACTION_URL } from "../commonUtils/ApiConstants";
import { BASE_URL } from "../commonUtils/Base";

class CustomerManagementService {

    getAllTransactionsSummary(obj: any) {
        return axios.post(BASE_URL + CUSTOMER_MANAGEMENT_URL.getAllTransactionBasedOnIp, obj);
    }
    ruleBasedCustomerRecomendation(id: any) {
        return axios.get(BASE_URL + TRANSACTION_URL.ruleBasedCustomerRecomendation + '/' + id);
    }
    ruleBasedBusinessRecomedation(id: any) {
        return axios.get(BASE_URL + TRANSACTION_URL.ruleBasedBusinessRecomedation + '/' + id);
    }
}

export default new CustomerManagementService();