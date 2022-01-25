import * as React from "react";

export interface IRequestFormProps {}

export interface IFooterState {
  home?: boolean;
}

export default class FooterElement extends React.Component<
  IRequestFormProps,
  IFooterState
> {
  constructor(props: IRequestFormProps) {
    super(props);
    this.state = {
      home: false,
    };
  }

  public componentDidMount(): void {}

  public render() {
    return <div>...</div>;
  }
}
