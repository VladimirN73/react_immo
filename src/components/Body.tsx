import * as React from "react";

import { TextField, DefaultButton } from "@fluentui/react";

export interface IRequestFormProps {}

export interface IBodyState {
  home?: boolean;
  wohnungspreis: string;
  stellplatzpreis: string;
  nebenkosten: number;
  nebenkostenProzent: number;
  kaufsumme: number;
  eigenkapital: string;
  kreditProzent: string;
  tilgingProzent: number;
  wg1?: number;
  wg2?: number;
  miete: string;
}

export default class BodyElement extends React.Component<IRequestFormProps, IBodyState> {
  constructor(props: IRequestFormProps) {
    super(props);
    this.state = {
      home: false,
      wohnungspreis: "",
      stellplatzpreis: "",
      nebenkosten: 0,
      nebenkostenProzent: 9,
      kaufsumme: 0,
      eigenkapital: "130.000",
      kreditProzent: "1,2",
      tilgingProzent: 1,
      // wg1: 0,
      // wg2: 0,
      miete: "",
      // nk: 0,
    };
  }

  public componentDidMount(): void {
    this.restoreStateFromLocalStorage();
  }

  public componentDidUpdate(): void {
    let temp = JSON.stringify(this.state);
    localStorage.setItem("temp", temp);
    console.log("(componentDidUpdate) temp", temp);
  }

  private restoreStateFromLocalStorage() {
    let temp = localStorage.getItem("temp");
    console.log("(restoreStateFromLocalStorage) temp", temp);
    if (!temp) {
      return;
    }

    try {
      const tempState = JSON.parse(temp ?? "");
      this.setState({ ...tempState });
    } catch (error) {
      console.log("(restoreStateFromLocalStorage) error", error);
    }
  }

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

    let ret = kosten - +this.formatRemovePoints(this.state.eigenkapital);

    if (ret < 0) ret = 0;

    return ret;
  }

  private calculateKreditMonat(): number {
    const kredit = this.calculateKredit();

    // adapt weight: from 1,1 to 1.1
    const kreditProzent = +this.state.kreditProzent.replace(",", ".");

    const prozent = kreditProzent + this.state.tilgingProzent;

    const ret = Math.ceil(((kredit / 100) * prozent) / 12);

    return ret;
  }

  private calculateCashflow(): number {
    const kreditProMonat = this.calculateKreditMonat();

    let ret =
      +this.formatRemovePoints(this.state.miete) - 
      kreditProMonat -
      (this.state.wg1 ? this.state.wg1 : 0);

    return ret;
  }

  private steuerBasisString(): string {
    const kredit = this.calculateKredit();
    const kreditProzent = +this.state.kreditProzent.replace(",", ".");
    const kostenZinsen = Math.ceil(((kredit / 100) * kreditProzent) / 12);

    const wohnungPlusStellplatz = this.calculateWohnungPlusStellplatz();
    const abschreibung = Math.ceil(((wohnungPlusStellplatz / 100) * 2) / 12);

    let ret: string =
      "(" + (this.state.miete ?? "0") + "-" + kostenZinsen + "-" + abschreibung + ") * 40% =";
    return ret;
  }

  private calculateSteuer(): number {
    const kredit = this.calculateKredit();
    const kreditProzent = +this.state.kreditProzent.replace(",", ".");
    const kostenZinsen = Math.ceil(((kredit / 100) * kreditProzent) / 12);

    const wohnungPlusStellplatz = this.calculateWohnungPlusStellplatz();
    const abschreibung = Math.ceil(((wohnungPlusStellplatz / 100) * 2) / 12);

    let ret: number = +this.formatRemovePoints(this.state.miete) - kostenZinsen - abschreibung;

    if (ret > 0) {
      ret = Math.ceil((ret / 100) * 40);
    } else {
      ret = 0;
    }

    return ret;
  }

  private calculateResultat(): number {
    const cashflow = this.calculateCashflow();
    const steuer = this.calculateSteuer();
    let ret = cashflow - steuer;
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
                style={{ textAlign: "right", borderColor:"red" }}
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
                placeholder="Stellplatzpreis"
                style={{ textAlign: "right" }}
                onChange={(e) => {
                  const val = (e.target as any).value as string;
                  console.log(val);
                  const temp = this.formatA(val);
                  this.setState({ stellplatzpreis: temp });
                }}
                value={this.state.stellplatzpreis ?? ""}
              />
            </div>
          </div>

          <div className="row mt-2">
            <div className="col-3">
              <label>NK % €</label>
            </div>

            <div className="col-1" style={{ textAlign: "right" }}>
              <DefaultButton
                style={{ padding: "0px", minWidth: "40px" }}
                onClick={() => {
                  let val = 7;
                  if (this.state.nebenkostenProzent === 7) {
                    val = 9;
                  }
                  this.setState({ nebenkostenProzent: val });
                }}
              >
                {" "}
                {this.state.nebenkostenProzent === 7 && "+"}
                {this.state.nebenkostenProzent !== 7 && "-"}
              </DefaultButton>
            </div>

            <div
              className="col-2"
              style={{ textAlign: "right", paddingLeft: "25px", paddingRight: "0px" }}
            >
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

            <div className="col-6">
              <TextField
                id="Nebenkosten"
                name="Nebenkosten"
                readOnly={true}
                placeholder="Nebenkosten"
                style={{ textAlign: "right", background: "whitesmoke" }}
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
                style={{ textAlign: "right", background: "whitesmoke" }}
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
                  const temp = this.formatA(val);
                  this.setState({ eigenkapital: temp });
                }}
                value={this.state.eigenkapital ?? ""}
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
                style={{ textAlign: "right", fontWeight: "bold", background: "whitesmoke" }}
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
                  this.setState({ kreditProzent: val });
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
                style={{ textAlign: "right", background: "whitesmoke" }}
                value={this.calculateKreditMonat() + ""}
              />
            </div>
          </div>

          <div className="row mt-2">
            <div className="col-6">
              <label>WG 1 und 2</label>
            </div>

            <div className="col-3">
              <TextField
                id="wg1"
                name="wg1"
                placeholder="WG1"
                type="number"
                style={{ textAlign: "right" }}
                onChange={(e) => {
                  const val = (e.target as any).value as number;
                  console.log(val);
                  this.setState({ wg1: val });
                }}
                value={this.state.wg1 + ""}
              />
            </div>

            <div className="col-3">
              <TextField
                id="wg2"
                name="wg2"
                placeholder="WG2"
                type="number"
                style={{ textAlign: "right" }}
                onChange={(e) => {
                  const val = (e.target as any).value as number;
                  console.log(val);
                  this.setState({ wg2: val });
                }}
                value={this.state.wg2 + ""}
              />
            </div>
          </div>

          <hr></hr>

          <div className="row mt-2">
            <div className="col-6">
              <label>Miete und NK</label>
            </div>

            <div className="col-3">
              <TextField
                id="miete"
                name="miete"
                placeholder="Miete"
                style={{ textAlign: "right" }}
                onChange={(e) => {
                  const val = (e.target as any).value as string;
                  console.log(val);
                  const temp = this.formatA(val);
                  this.setState({ miete: temp });
                }}
                value={this.state.miete ?? ""}
              />
            </div>

            <div className="col-3">
              <TextField
                id="nk"
                name="nk"
                placeholder="NK"
                // style={{ textAlign: "right" }}
                // type="number"
                // onChange={(e) => {
                //   const val = (e.target as any).value as number;
                //   console.log(val);
                //   this.setState({ nk: val });
                // }}
                // value={this.state.nk + ""}
                readOnly={true}
                style={{ textAlign: "right", background: "whitesmoke" }}
                value={this.state.wg2 ? this.state.wg2 + "" : ""}
              />
            </div>
          </div>

          <hr></hr>

          <div className="row mt-3">
            <div className="col-6">
              <label>Cashflow</label>
            </div>
            <div className="col-6">
              <TextField
                id="Cashflow"
                name="Cashflow"
                readOnly={true}
                style={{
                  textAlign: "right",
                  fontWeight: "bold",
                  background: "whitesmoke",
                  color: this.calculateCashflow() < 0 ? "red" : "green",
                }}
                value={this.formatA(this.calculateCashflow() + "")}
              />
            </div>
          </div>
          <hr></hr>
          <div className="row mt-3">
            <div className="col-2">
              <label>Steuer</label>
            </div>
            <div className="col-7">
              <TextField
                id="SteuerBasis"
                name="SteuerBasis"
                readOnly={true}
                style={{
                  textAlign: "right",
                  background: "whitesmoke",
                }}
                value={this.steuerBasisString()}
              />
            </div>
            <div className="col-3">
              <TextField
                id="Steuer"
                name="Steuer"
                readOnly={true}
                style={{
                  textAlign: "right",
                  fontWeight: "bold",
                  background: "whitesmoke",
                }}
                value={this.calculateSteuer() + ""}
              />
            </div>
          </div>

          <hr></hr>

          <div className="row mt-3">
            <div className="col-6">
              <label>Resultat</label>
            </div>
            <div className="col-6">
              <TextField
                id="Resultat"
                name="Resultat"
                readOnly={true}
                style={{
                  textAlign: "right",
                  fontWeight: "bold",
                  background: "whitesmoke",
                  color: this.calculateResultat() < 0 ? "red" : "green",
                }}
                value={this.formatA(this.calculateResultat() + "")}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
