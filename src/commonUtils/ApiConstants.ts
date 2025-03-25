export const LOGIN_URL = {
  login: "/api/v1/auth/login",
  getlatlogin: "/api/v1/users/details"
};

export const ALERT_URL = {
  getAllAlerts: "/api/v1/alerts?",
  getAlertCount: "/api/v1/alerts/count",
  getAlertById: "/api/v1/alerts/",
  getAlertLocation: "/api/v1/alerts/count-by-location"
};

export const TRANSACTION_URL = {
  getAllTransactions: "/api/v1/transactions",
  getAllTransactionsSummary: "/api/v1/transactions/summary",
  transaction: "/api/v1/aml/post-transaction",
  customerAIRecomendation: '/api/v1/recommendations/customer',
  BusinessAIRecomendation: '/api/v1/recommendations/business'
}


export const CASE_MANAGEMANT_URL = {
  getAllCases: "/api/v1/cases",
  getCaseSummary: "/api/v1/transactions/summary",
  caseCount: "/api/v1/cases/case-count",
  caseComments: "/api/v1/comments",
  uploadDcuments: '/api/v1/attachments/upload',

}


export const CUSTOMER_MANAGEMENT_URL = {
  getAllTransactionBasedOnIp: "/api/v1/query/execute",


}


export const CASE_URL = {
  createcase: "/api/v1/cases"
}

export const REPORTS_URL = {
  getgetRiskAssessment: "/risk_assessment?"
}