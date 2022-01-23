import * as React from "react";

import { TextField, MaskedTextField } from "@fluentui/react";

export interface IRequestFormProps {}

export interface IBodyState {
  home?: boolean;
  wohnungspreis: string;
  stellplatzpreis: string;
  nebenkosten: number;
  nebenkostenProzent: number;
  kaufsumme: number;
  eigenkapital: number;
  kreditProzent: number;
  tilgingProzent: number;
}

export default class BodyElement extends React.Component<IRequestFormProps, IBodyState> {
  constructor(props: IRequestFormProps) {
    super(props);
    this.state = {
      home: false,
      wohnungspreis: "",
      stellplatzpreis: "",
      nebenkosten: 0,
      nebenkostenProzent: 7,
      kaufsumme: 0,
      eigenkapital: 130000,
      kreditProzent: 1.2,
      tilgingProzent: 1,
    };
  }

  public componentDidMount(): void {}

  private calculateSummeX(): void {
    var temp: IBodyState = this.state;

    const WohnungPlusStellplatz = +temp.wohnungspreis + +temp.stellplatzpreis;

    temp.nebenkosten = Math.ceil((WohnungPlusStellplatz / 100) * temp.nebenkostenProzent);

    temp.kaufsumme = WohnungPlusStellplatz + temp.nebenkosten;

    this.setState({ nebenkosten: temp.nebenkosten, kaufsumme: temp.kaufsumme });
  }

  private calculateWohnungPlusStellplatz(): number {
    var temp: IBodyState = this.state;

    const ret =
      +this.formatRemovePoints(temp.wohnungspreis) + +this.formatRemovePoints(temp.stellplatzpreis);

    return ret;
  }

  private calculateNebenkosten(): number {
    var temp: IBodyState = this.state;

    const WohnungPlusStellplatz = this.calculateWohnungPlusStellplatz();

    const ret = Math.ceil((WohnungPlusStellplatz / 100) * temp.nebenkostenProzent);

    return ret;
  }

  private calculateSumme(): number {
    const WohnungPlusStellplatz = this.calculateWohnungPlusStellplatz();
    const nebenkosten = this.calculateNebenkosten();

    const ret = WohnungPlusStellplatz + nebenkosten;

    return ret;
  }

  private calculateKredit(): number {
    const kosten = this.calculateSumme();

    let ret = kosten - this.state.eigenkapital;

    if (ret < 0) ret = 0;

    return ret;
  }

  private calculateKreditMonat(): number {
    const kredit = this.calculateKredit();

    const prozent = this.state.kreditProzent + this.state.tilgingProzent;

    const ret = Math.ceil(((kredit / 100) * prozent) / 12);

    return ret;
  }

  private formatRemovePoints(val: string): string {
    const ret = val.replace(".", "");
    return ret;
  }

  private formatA(val: string): string {
    const ret = val
      .toString()
      .replace(".", "")
      .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".");
    return ret;
  }

  public render() {
    return (
      <div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-6">
              <label>Wohnung</label>
            </div>
            <div className="col-6">
              <TextField
                id="Wohnung"
                name="Wohnung"
                style={{ textAlign: "right" }}
                //type="number"
                onChange={(e) => {
                  const val = (e.target as any).value as string;
                  console.log(val);
                  const temp = this.formatA(val);
                  this.setState({ wohnungspreis: temp });
                }}
                placeholder="Wohnungspreis"
                value={this.state.wohnungspreis ?? ""}
              />
            </div>
          </div>

          <div className="row mt-2">
            <div className="col-6">
              <label>Stellplatz</label>
            </div>
            <div className="col-6">
              <TextField
                id="Stellplatz"
                name="Stellplatz"
                style={{ textAlign: "right" }}
                onChange={(e) => {
                  const val = (e.target as any).value as string;
                  console.log(val);
                  const temp = this.formatA(val);
                  this.setState({ stellplatzpreis: temp });
                }}
                placeholder="stellplatzpreis"
                value={this.state.stellplatzpreis ?? ""}
              />
            </div>
          </div>

          <div className="row mt-2">
            <div className="col-2">
              <label>NK%</label>
            </div>

            <div className="col-2">
              <TextField
                id="NebenkostenProzent"
                name="NebenkostenProzent"
                placeholder="NK %"
                onChange={(e) => {
                  const val = (e.target as any).value as string;
                  console.log(val);
                  this.setState({ nebenkostenProzent: +val });
                }}
                value={this.state.nebenkostenProzent + "" ?? ""}
              />
            </div>

            <div className="col-2">
              <label>NK</label>
            </div>
            <div className="col-6">
              <TextField
                id="Nebenkosten"
                name="Nebenkosten"
                readOnly={true}
                placeholder="Nebenkosten"
                style={{ textAlign: "right" }}
                value={this.formatA(this.calculateNebenkosten() + "")}
              />
            </div>
          </div>

          <div className="row mt-2">
            <div className="col-6">
              <label>Kaufsumme</label>
            </div>
            <div className="col-6">
              <TextField
                id="Kaufsumme"
                name="Kaufsumme"
                readOnly={true}
                style={{ textAlign: "right" }}
                value={this.formatA(this.calculateSumme() + "")}
              />
            </div>
          </div>

          <div className="row mt-2">
            <div className="col-6">
              <label>EK</label>
            </div>
            <div className="col-6">
              <TextField
                id="EK"
                name="EK"
                style={{ textAlign: "right" }}
                onChange={(e) => {
                  const val = (e.target as any).value as string;
                  console.log(val);
                  this.setState({ eigenkapital: +val });
                }}
                value={this.formatA(this.state.eigenkapital + "")}
              />
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-6">
              <label>Kredit</label>
            </div>
            <div className="col-6">
              <TextField
                id="Kredit"
                name="Kredit"
                readOnly={true}
                style={{ textAlign: "right", fontWeight: "bold" }}
                value={this.formatA(this.calculateKredit() + "")}
              />
            </div>
          </div>

          <div className="row mt-2">
            <div className="col-1">
              <label>%</label>
            </div>

            <div className="col-3">
              <TextField
                id="kreditProzent"
                name="kreditProzent"
                onChange={(e) => {
                  const val = (e.target as any).value as string;
                  console.log(val);
                  this.setState({ kreditProzent: +val });
                }}
                value={this.state.kreditProzent + "" ?? ""}
              />
            </div>

            <div className="col-2">
              <TextField
                id="tilgungProzent"
                name="tilgungProzent"
                onChange={(e) => {
                  const val = (e.target as any).value as string;
                  console.log(val);
                  this.setState({ tilgingProzent: +val });
                }}
                value={this.state.tilgingProzent + "" ?? ""}
              />
            </div>

            <div className="col-1">
              <label>€</label>
            </div>
            <div className="col-5">
              <TextField
                id="kreditMonat"
                name="kreditMonat"
                readOnly={true}
                style={{ textAlign: "right" }}
                value={this.calculateKreditMonat() + ""}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
