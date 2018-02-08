import {Injectable} from '@angular/core';
import {LoadingIndicator} from 'nativescript-loading-indicator';

@Injectable()
export class LoaderService {
  private loader: LoadingIndicator = new LoadingIndicator();
  private defaultOptions: any;

  constructor() {
    this.defaultOptions = {
      message: 'Loading...',
      progress: 0.65,
      android: {
        indeterminate: true,
        cancelable: true,
        max: 100,
        progressNumberFormat: "%1d/%2d",
        progressPercentFormat: 0.53,
        progressStyle: 1,
        secondaryProgress: 1
      },
      ios: {
        details: "Additional detail note!",
        margin: 10,
        dimBackground: true,
        color: "#4B9ED6", // color of indicator and labels
        // background box around indicator
        // hideBezel will override this if true
        backgroundColor: "yellow",
        userInteractionEnabled: false, // default true. Set false so that the touches will fall through it.
        hideBezel: true, // default false, can hide the surrounding bezel
        view: 'UIView', // Target view to show on top of (Defaults to entire window)
      }
    };
  }



  public showLoader(msg?: string) {
    if (msg && msg !== '') {
      let options = Object.assign({}, this.defaultOptions, { message: msg });
      this.loader.show(options);
    } else {
      this.loader.show(this.defaultOptions);
    }
  }

  public hideLoader() {
    this.loader.hide();
  }
}
