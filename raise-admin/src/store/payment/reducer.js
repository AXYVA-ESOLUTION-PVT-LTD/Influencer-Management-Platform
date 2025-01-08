import {
  GET_TRANSACTION_REQUEST,
  GET_TRANSACTION_SUCCESS,
  GET_TRANSACTION_ERROR,
  GET_WALLET_AMOUNT_REQUEST,
  GET_WALLET_AMOUNT_SUCCESS,
  GET_WALLET_AMOUNT_ERROR,
  CREATE_TRANSACTION_REQUEST,
  CREATE_TRANSACTION_SUCCESS,
  CREATE_TRANSACTION_ERROR,
  REMOVE_TRANSACTION_REQUEST,
  REMOVE_TRANSACTION_SUCCESS,
  REMOVE_TRANSACTION_ERROR,
  UPDATE_TRANSACTION_REQUEST,
  UPDATE_TRANSACTION_SUCCESS,
  UPDATE_TRANSACTION_ERROR,
  UPDATE_WALLET_FAIL,
  UPDATE_WALLET_SUCCESS,
  UPDATE_WALLET,
  GET_WALLET_FAIL,
  GET_WALLET_SUCCESS,
  GET_WALLET,
  GET_PAYMENT_METHOD,
  GET_PAYMENT_METHOD_SUCCESS,
  GET_PAYMENT_METHOD_FAIL,
  GET_PAYMENT_DETAIL,
  GET_PAYMENT_DETAIL_SUCCESS,
  GET_PAYMENT_DETAIL_FAIL,
  ADD_PAYMENT_DETAIL,
  ADD_PAYMENT_DETAIL_SUCCESS,
  ADD_PAYMENT_DETAIL_FAIL,
  UPDATE_PAYMENT_DETAIL,
  UPDATE_PAYMENT_DETAIL_SUCCESS,
  UPDATE_PAYMENT_DETAIL_FAIL,
  FETCH_ALL_PAYMENT_DETAILS,
  FETCH_ALL_PAYMENT_DETAILS_SUCCESS,
  FETCH_ALL_PAYMENT_DETAILS_FAIL,
  DELETE_PAYMENT_DETAILS,
  DELETE_PAYMENT_DETAILS_SUCCESS,
  DELETE_PAYMENT_DETAILS_FAIL,
  FETCH_ALL_SECURE_PAYMENT_DETAILS,
  FETCH_ALL_SECURE_PAYMENT_DETAILS_SUCCESS,
  FETCH_ALL_SECURE_PAYMENT_DETAILS_FAIL,
} from "./actionTypes";

const initialState = {
  wallets: [],
  totalWallets: null,
  transaction: [],
  totalTransactions: null,
  walletAmount: null,
  loading: false,
  error: null,
  paymentMethods: null,
  paymentMethodsloading :false,
  // fieldValue: null,
  // fieldNames: null,
  updatedField: null,
  successMessages: "",
  errorMessages: "",
  paymentDetail: null,
  paymentSecureDetails: null,
  isPaymentDeleted: false,
};

const Payment = (state = initialState, action) => {
  switch (action.type) {
    // Transaction fetching actions
    case GET_TRANSACTION_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_TRANSACTION_SUCCESS:
      return {
        ...state,
        loading: false,
        transaction: action.payload.data,
        totalTransactions: action.payload.totalRecords,
        error: null,
      };
    case GET_TRANSACTION_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Wallet amount actions
    case GET_WALLET_AMOUNT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_WALLET_AMOUNT_SUCCESS:
      return {
        ...state,
        loading: false,
        walletAmount: action.payload.balance,
        error: null,
      };
    case GET_WALLET_AMOUNT_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case CREATE_TRANSACTION_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case CREATE_TRANSACTION_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case CREATE_TRANSACTION_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case REMOVE_TRANSACTION_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case REMOVE_TRANSACTION_SUCCESS:
      return {
        ...state,
        loading: false,
        transaction: state.transaction.filter(
          (transaction) => transaction._id !== action.payload
        ),
        error: null,
      };
    case REMOVE_TRANSACTION_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    // Update transaction actions
    case UPDATE_TRANSACTION_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case UPDATE_TRANSACTION_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case UPDATE_TRANSACTION_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case GET_WALLET:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_WALLET_SUCCESS:
      return {
        ...state,
        wallets: [...action.payload.wallets],
        totalWallets: action.payload.totalWallets,
        loading: false,
        error: null,
      };
    case GET_WALLET_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case UPDATE_WALLET:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case UPDATE_WALLET_SUCCESS:
      const { _id: updatedWalletId } = action.payload;
      return {
        ...state,
        wallets: state.wallets.map((wallet) =>
          wallet._id === updatedWalletId ? { ...action.payload } : wallet
        ),
        loading: false,
      };
    case UPDATE_WALLET_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case GET_PAYMENT_METHOD:
      return {
        ...state,
        paymentMethodsloading: true,
        error: null,
        paymentMethods: null,
      };
    case GET_PAYMENT_METHOD_SUCCESS:
      return {
        ...state,
        paymentMethods: action.payload,
        paymentMethodsloading: false,
      };
    case GET_PAYMENT_METHOD_FAIL:
      return {
        ...state,
        error: action.payload,
        paymentMethodsloading: false,
        paymentMethods: null,
      };
    case GET_PAYMENT_DETAIL:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_PAYMENT_DETAIL_SUCCESS:
      const { fieldName, fieldValue } = action.payload;
      return {
        ...state,
        updatedField: {fieldValue: fieldValue,
        fieldNames: fieldName},
        loading: false,
      };
    case GET_PAYMENT_DETAIL_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case ADD_PAYMENT_DETAIL:
      return {
        ...state,
        loading: true,
        error: null,
        errorMessages: "",
        successMessages: "",
      };
    case ADD_PAYMENT_DETAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        successMessages: action.payload,
        errorMessages: "",
      };
    case ADD_PAYMENT_DETAIL_FAIL:
      return {
        ...state,
        loading: false,
        errorMessages: action.payload,
        successMessages: "",
      };
    case UPDATE_PAYMENT_DETAIL:
      return {
        ...state,
        loading: true,
        error: null,
        errorMessages: "",
        successMessages: "",
      };

    case UPDATE_PAYMENT_DETAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        successMessages: action.payload,
        errorMessages: "",
      };

    case UPDATE_PAYMENT_DETAIL_FAIL:
      return {
        ...state,
        loading: false,
        errorMessages: action.payload,
        successMessages: "",
      };
    case FETCH_ALL_PAYMENT_DETAILS:
      return {
        ...state,
        loading: true,
        error: null,
        errorMessages: "",
        successMessages: "",
        paymentDetail: null,
      };

    case FETCH_ALL_PAYMENT_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        paymentDetail: action.payload,
        successMessages: "",
        errorMessages: "",
      };

    case FETCH_ALL_PAYMENT_DETAILS_FAIL:
      return {
        ...state,
        loading: false,
        errorMessages: action.payload,
        successMessages: "",
        paymentDetail: null,
      };
    case DELETE_PAYMENT_DETAILS:
      return {
        ...state,
        loading: true,
        error: null,
        isPaymentDeleted: false,
      };

    case DELETE_PAYMENT_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        isPaymentDeleted: true,
        successMessages: '',
      };

    case DELETE_PAYMENT_DETAILS_FAIL:
      return {
        ...state,
        loading: false,
        isPaymentDeleted: false,
      };
    case FETCH_ALL_SECURE_PAYMENT_DETAILS:
      return {
        ...state,
        loading: true,
        errorMessages: "",
        paymentSecureDetails: null,
      };

    case FETCH_ALL_SECURE_PAYMENT_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        paymentSecureDetails: action.payload,
        errorMessages: "",
      };

    case FETCH_ALL_SECURE_PAYMENT_DETAILS_FAIL:
      return {
        ...state,
        loading: false,
        errorMessages: action.payload,
        paymentSecureDetails: null,
      };

    default:
      return state;
  }
};

export default Payment;
