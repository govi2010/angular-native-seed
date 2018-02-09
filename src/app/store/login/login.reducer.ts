import { CustomActions } from '../customActions';
import { LoginConstants } from '../../actions/login/login.const';
import { VerifyEmailResponseModel, VerifyMobileResponseModel, VerifyMobileModel } from '../../models/api-models/loginModels';
import { LoginWithPassword, SignUpWithPassword } from '../../models/api-models/Login';
import { BaseResponse } from '../../models/api-models/BaseResponse';

export interface LoginState {
  isSignupInProcess: boolean;
  isSignUpSuccess: boolean;
  isLoginWithPasswordInProcess: boolean;
  isLoginWithPasswordSuccess: boolean;
  isLoginWithMobileInProcess: boolean;
  isLoginWithMobileSubmited: boolean;
  isVerifyMobileInProcess: boolean;
  isVerifyMobileSuccess: boolean;
  isLoginWithEmailInProcess: boolean;
  isLoginWithEmailSubmited: boolean;
  isVerifyEmailInProcess: boolean;
  isVerifyEmailSuccess: boolean;
  isTwoWayAuthInProcess: boolean;
  isTwoWayAuthSuccess: boolean;
  isForgotPasswordInProcess: boolean;
  isForgotPasswordSuccess: boolean;
  isResetPasswordInProcess: boolean;
  isResetPasswordSuccess: boolean;
  isSignupWithGoogleInProcess: boolean;
  isSignupWithGoogleSuccess: boolean;
  user: VerifyEmailResponseModel;
}

const initialState: LoginState = {
  isSignupInProcess: false,
  isSignUpSuccess: false,
  isLoginWithPasswordInProcess: false,
  isLoginWithPasswordSuccess: false,
  user: null,
  isLoginWithMobileInProcess: false,
  isLoginWithMobileSubmited: false,
  isVerifyMobileInProcess: false,
  isVerifyMobileSuccess: false,
  isLoginWithEmailInProcess: false,
  isLoginWithEmailSubmited: false,
  isVerifyEmailInProcess: false,
  isVerifyEmailSuccess: false,
  isTwoWayAuthInProcess: false,
  isTwoWayAuthSuccess: false,
  isForgotPasswordInProcess: false,
  isForgotPasswordSuccess: false,
  isResetPasswordInProcess: false,
  isResetPasswordSuccess: false,
  isSignupWithGoogleInProcess: false,
  isSignupWithGoogleSuccess: false
}

export function LoginReducer(state: LoginState = initialState, action: CustomActions): LoginState {
  switch (action.type) {
    case LoginConstants.LOGIN_WITH_PASSWORD_REQUEST:
      return Object.assign({}, state, {
        isLoginWithPasswordInProcess: true
      });
    case LoginConstants.LOGIN_WITH_PASSWORD_RESPONSE: {
      let res: BaseResponse<VerifyMobileResponseModel, LoginWithPassword> = action.payload;
      if (action.payload.status === 'success') {
        return Object.assign({}, state, {
          user: res.body,
          isLoginWithPasswordInProcess: false,
          isLoginWithPasswordSuccess: true
        })
      }
      return Object.assign({}, state, {
        isLoginWithPasswordInProcess: false,
        isLoginWithPasswordSuccess: false
      })
    }
    case LoginConstants.LOGOUT: {
      return initialState;
    }
    case LoginConstants.SIGNUP_REQUEST:
      return Object.assign({}, state, {
        isSignupInProcess: true
      })
    case LoginConstants.SIGNUP_RESPONSE: {
      let res: BaseResponse<VerifyMobileResponseModel, SignUpWithPassword> = action.payload;
      if (action.payload.status === 'success') {
        return Object.assign({}, state, {
          isSignupInProcess: false,
          isSignUpSuccess: true
        })
      }
      return Object.assign({}, state, {
        isSignupInProcess: false,
        isSignUpSuccess: false
      })
    }

    case LoginConstants.SIGNUP_WITH_MOBILE_REQUEST:
      return Object.assign({}, state, {
        isLoginWithMobileInProcess: true
      });
    case LoginConstants.SIGNUP_WITH_MOBILE_RESPONCE:
      if (action.payload.status === 'success') {
        return Object.assign({}, state, {
          isLoginWithMobileSubmited: true,
          isLoginWithMobileInProcess: false
        });
      }
      return Object.assign({}, state, {
        isLoginWithMobileSubmited: false,
        isLoginWithMobileInProcess: false
      });

    case LoginConstants.VERIFY_MOBILE_REQUEST:
      return Object.assign({}, state, {
        isVerifyMobileInProcess: true
      });

    case LoginConstants.VERIFY_MOBILE_RESPONCE: {
      let data1: BaseResponse<VerifyMobileResponseModel, VerifyMobileModel> = action.payload;
      if (data1.status === 'success') {
        return Object.assign({}, state, {
          isVerifyMobileInProcess: false,
          isVerifyMobileSuccess: true,
        });
      } else {
        return Object.assign({}, state, {
          isVerifyMobileInProcess: false,
          isVerifyMobileSuccess: false
        });
      }
    }

    case LoginConstants.SIGNUP_WITH_GOOGLE_REQUEST:
      return Object.assign({}, state, {
        isSignupWithGoogleInProcess: true
      })

    case LoginConstants.SIGNUP_WITH_GOOGLE_RESPONSE: {
      let data: BaseResponse<VerifyEmailResponseModel, string> = action.payload;
      if (data.status === 'success') {
        return Object.assign({}, state, {
          isSignupWithGoogleInProcess: false,
          isSignupWithGoogleSuccess: true
        })
      }
      return Object.assign({}, state, {
        isSignupWithGoogleInProcess: false,
        isSignupWithGoogleSuccess: false
      })
    }

    case LoginConstants.VERIFY_TWOWAYAUTH_REQUEST: {
      return Object.assign({}, state, {
        isTwoWayAuthInProcess: true
      });
    }
    case LoginConstants.VERIFY_TWOWAYAUTH_RESPONSE: {
      if (action.payload.status === 'success') {
        return Object.assign({}, state, {
          isTwoWayAuthInProcess: false,
          isTwoWayAuthSuccess: true
        });
      }
      return Object.assign({}, state, {
        isTwoWayAuthInProcess: false,
        isTwoWayAuthSuccess: false
      });
    }

    case LoginConstants.FORGOT_PASSWORD_REQUEST: {
      return Object.assign({}, state, {
        isForgotPasswordInProcess: true
      })
    }
    case LoginConstants.FORGOT_PASSWORD_RESPONSE: {
      if (action.payload.status === 'success') {
        return Object.assign({}, state, {
          isForgotPasswordInProcess: false, isForgotPasswordSuccess: true
        })
      }
      return Object.assign({}, state, {
        isForgotPasswordInProcess: false, isForgotPasswordSuccess: false
      })
    }

    case LoginConstants.RESET_FORGOT_PASSWORD_FLAGS: {
      return Object.assign({}, state, {
        isForgotPasswordInProcess: false, isForgotPasswordSuccess: false
      })
    }

    case LoginConstants.RESET_PASSWORD_V2_REQUEST: {
      return Object.assign({}, state, {
        isResetPasswordInProcess: true
      })
    }
    case LoginConstants.RESET_PASSWORD_V2_RESPONSE: {
      if (action.payload.status === 'success') {
        return Object.assign({}, state, {
          isResetPasswordInProcess: false, isResetPasswordSuccess: true
        })
      }
      return Object.assign({}, state, {
        isResetPasswordInProcess: false, isResetPasswordSuccess: false
      })
    }

    case LoginConstants.RESET_RESET_PASSWORD_FLAGS: {
      return Object.assign({}, state, {
        isResetPasswordInProcess: false, isResetPasswordSuccess: false
      })
    }

    case LoginConstants.RESET_LOGIN_OTP_FLAGS: {
      return Object.assign({}, state, {
        isLoginWithMobileSubmited: false,
        isVerifyMobileSuccess: false,
        isLoginWithMobileInProcess: false,
        isVerifyMobileInProcess: false
      })
    }

    case LoginConstants.SIGNUP_WITH_EMAIL_REQUEST:
      return Object.assign({}, state, {
        isLoginWithEmailInProcess: true
      });
    case LoginConstants.SIGNUP_WITH_EMAIL_RESPONCE:
      if (action.payload.status === 'success') {
        return Object.assign({}, state, {
          isLoginWithEmailSubmited: true,
          isLoginWithEmailInProcess: false
        });
      }
      return Object.assign({}, state, {
        isLoginWithEmailSubmited: false,
        isLoginWithEmailInProcess: false
      });

    case LoginConstants.VERIFY_EMAIL_REQUEST:
      return Object.assign({}, state, {
        isVerifyEmailInProcess: true
      });

    case LoginConstants.VERIFY_EMAIL_RESPONCE:
      let data1: BaseResponse<VerifyMobileResponseModel, VerifyMobileModel> = action.payload;
      if (data1.status === 'success') {
        return Object.assign({}, state, {
          isVerifyEmailInProcess: false,
          isVerifyEmailSuccess: true,
        });
      } else {
        return Object.assign({}, state, {
          isVerifyEmailInProcess: false,
          isVerifyMobileSuccess: false
        });
      }

    case LoginConstants.RESET_LOGIN_WITH_EMAIL_FLAGS:
      return Object.assign({}, state, {
        isLoginWithEmailSubmited: false,
        isLoginWithEmailInProcess: false,
        isVerifyEmailInProcess: false,
        isVerifyMobileSuccess: false
      });
    case LoginConstants.RESET_LOGIN_STATE:
      return initialState;

    default:
      return state;
  }
}
