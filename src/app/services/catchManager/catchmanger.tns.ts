import { Injectable } from '@angular/core';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { Observable } from 'rxjs/Observable';
import * as Toast from 'nativescript-toast';
// import { LoginActions } from '../actions/login.action';

@Injectable()
export class ErrorHandler {

    constructor() {
    }

    public HandleCatch<TResponce, TRequest>(r: any, request?: any, queryString?: any): Observable<BaseResponse<TResponce, TRequest>> {
        let data: BaseResponse<TResponce, TRequest> = new BaseResponse<TResponce, TRequest>();

        let toast = Toast.makeText('Something went wrong');
        toast.show();

        // logout if invalid session detacted
        if (r.status === 0) {
            data = {
                body: null,
                code: 'Internal Error',
                message: 'something went wrong',
                status: 'error'
            };
            data.request = request;
            data.queryString = queryString;
        } else {
            if (r.text() === '') {
                //
                data.status = 'error';
                data.message = 'Something went wrong';
                data.body = null;
                data.code = 'Internal Error';
            } else {
                data = r.json();
                if (data.code === 'SESSION_EXPIRED_OR_INVALID') {
                    // this.store.dispatch({type: 'LoginOut'});
                } else if (data.code === '') {
                    // handle unshared company response
                    // this.store.dispatch({type: 'CompanyRefresh'});
                }
            }
            data.request = request;
            data.queryString = queryString;
        }
        return new Observable<BaseResponse<TResponce, TRequest>>((o) => {
            o.next(data);
        });
    }

}

export function HandleCatch<TResponce, TRequest>(r: any, request?: any, queryString?: any): Observable<BaseResponse<TResponce, TRequest>> {
    let data: BaseResponse<TResponce, TRequest> = new BaseResponse<TResponce, TRequest>();
    // logout if invalid session detacted
    if (r.status === 0) {
        data = {
            body: null,
            code: 'Internal Error',
            message: 'something went wrong',
            status: 'error'
        };
        data.request = request;
        data.queryString = queryString;
    } else {
        if (r.text() === '') {
            //
            data.status = 'error';
            data.message = 'Something went wrong';
            data.body = null;
            data.code = 'Internal Error';
        } else {
            data = r.json();
            if (data.code === 'SESSION_EXPIRED_OR_INVALID') {
                // this.store.dispatch('LoginOut');
                // this.store.dispatch({type: 'LoginOut'});
            }
        }
        data.request = request;
        data.queryString = queryString;
    }
    return new Observable<BaseResponse<TResponce, TRequest>>((o) => {
        o.next(data);
    });
}
