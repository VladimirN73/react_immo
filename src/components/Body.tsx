import * as React from "react";

import { TextField } from "@fluentui/react";

export interface IRequestFormProps {}

export interface IBodyState {
  home?: boolean;
  wohnungspreis: string;
  stellplatzpreis: string;
}

export default class BodyElement extends React.Component<IRequestFormProps, IBodyState> {
  constructor(props: IRequestFormProps) {
    super(props);
    this.state = {
      home: false,
      wohnungspreis: "",
      stellplatzpreis: "",
    };
  }

  public componentDidMount(): void {}

  public render() {
    return (
      <div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm">
              <TextField
                id="Wohnung"
                name="Wohnung"
                label="Wohnung"
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

          <div className="row">
            <div className="col-sm">
              <TextField
                id="Stellplatz"
                name="Stellplatz"
                label="Stellplatz"
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
        </div>
      </div>
    );
  }
}
