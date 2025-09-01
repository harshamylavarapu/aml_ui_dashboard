import { BASE_TRANS_URL, BASE_URL } from "../commonUtils/Base";
import axios from "axios";
import { TRANSACTION_URL } from "../commonUtils/ApiConstants";

class TrasactionsService {
  getAllTrasactions(page: number, size: number) {
    return axios.get(`${BASE_URL + TRANSACTION_URL.getAllTransactions}?page=${page}&size=${size}`);
  }

  getTrasactionById(id: any) {
    return axios.get(`${BASE_URL + TRANSACTION_URL.getAllTransactions}/${id}`);
  }
  getAllTransactionsSummary() {
    return axios.get(BASE_URL + TRANSACTION_URL.getAllTransactionsSummary);
  }
  transaction(obj: any) {
    return axios.post(BASE_TRANS_URL + TRANSACTION_URL.transaction, obj);
  }
  customerAIRecomendation(id: any) {
    return axios.get(`${BASE_URL + TRANSACTION_URL.customerAIRecomendation}/${id}`);
  }
  BusinessAIRecomendation(id: any) {
    return axios.get(`${BASE_URL + TRANSACTION_URL.BusinessAIRecomendation}/${id}`);
  }

}

export default new TrasactionsService();