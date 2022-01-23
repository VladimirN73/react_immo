import * as React from "react";

import { TextField } from "@fluentui/react";

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

  private calculateNebenkosten(): number {
    var temp: IBodyState = this.state;

    const WohnungPlusStellplatz = +temp.wohnungspreis + +temp.stellplatzpreis;

    const nebenkosten = Math.ceil((WohnungPlusStellplatz / 100) * temp.nebenkostenProzent);

    return nebenkosten;
  }

  private calculateSumme(): number {
    var temp: IBodyState = this.state;

    const nebenkosten = this.calculateNebenkosten();

    const WohnungPlusStellplatz = +temp.wohnungspreis + +temp.stellplatzpreis;

    const ret = WohnungPlusStellplatz + nebenkosten;

    return ret;
  }

  private calculateKredit(): number {
    const kosten = this.calculateSumme();

    const ret = kosten - this.state.eigenkapital;

    return ret;
  }

  private calculateKreditMonat(): number {
    const kredit = this.calculateKredit();

    const prozent = this.state.kreditProzent + this.state.tilgingProzent;

    const ret = Math.ceil(((kredit / 100) * prozent) / 12);

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
                //label="Wohnung"
                onChange={(e) => {
                  const val = (e.target as any).value as string;
                  console.log(val);
                  this.setState({ wohnungspreis: val });
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
                //label="Stellplatz"
                onChange={(e) => {
                  const val = (e.target as any).value as string;
                  console.log(val);
                  this.setState({ stellplatzpreis: val });
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
                //label="NK %"
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
                //label="Nebenkosten"
                readOnly={true}
                placeholder="Nebenkosten"
                value={this.calculateNebenkosten() + ""}
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
                //label="Kaufsumme"
                readOnly={true}
                value={this.calculateSumme() + ""}
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
                onChange={(e) => {
                  const val = (e.target as any).value as string;
                  console.log(val);
                  this.setState({ eigenkapital: +val });
                }}
                value={this.state.eigenkapital + "" ?? ""}
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
                value={this.calculateKredit() + ""}
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
                value={this.calculateKreditMonat() + ""}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
