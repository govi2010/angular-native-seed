export class LoginVM {

  private _value: string;
  public get value(): string {
    return this._value;
  }
  public set value(v: string) {
    this._value = v;
  }

}
