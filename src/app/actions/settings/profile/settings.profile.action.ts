import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../../../store';
import { Observable } from 'rxjs/Observable';
import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { Router } from '@angular/router';
import { SettingsProfileService } from '../../../services/settings.profile.service';
import { CustomActions } from '../../../store/customActions';
import { SettingsProfileConstants } from "../../../actions/settings/profile/settings.profile.const";

@Injectable()
export class SettingsProfileActions {

  @Effect()
  public UpdateProfile$: Observable<Action> = this.action$
    .ofType(SettingsProfileConstants.UPDATE_PROFILE)
    .switchMap((action: CustomActions) => {
      return this.settingsProfileService.UpdateProfile(action.payload)
        .map(response => this.UpdateProfileResponse(response));
    });

  @Effect()
  private UpdateProfileResponse$: Observable<Action> = this.action$
    .ofType(SettingsProfileConstants.UPDATE_PROFILE_RESPONSE)
    .map((response: CustomActions) => {
      let data: BaseResponse<any, any> = response.payload;
      if (data.status === 'error') {
        // dialogs.alert(data.message);
      } else {
        // let toast = Toast.makeText('Profile Updated Successfully');
        // toast.show();
      }
      return { type: 'EmptyAction' };
    });

  constructor(private action$: Actions,
    private router: Router,
    private store: Store<AppState>,
    private settingsProfileService: SettingsProfileService) {
  }

  public UpdateProfile(value): CustomActions {
    return {
      type: SettingsProfileConstants.UPDATE_PROFILE,
      payload: value
    };
  }

  public UpdateProfileResponse(value): CustomActions {
    return {
      type: SettingsProfileConstants.UPDATE_PROFILE_RESPONSE,
      payload: value
    };
  }

  public ResetUpdateProfileFlag(): CustomActions {
    return {
      type: SettingsProfileConstants.RESET_UPDATE_PROFILE_UI_FLAGS
    };
  }
}
