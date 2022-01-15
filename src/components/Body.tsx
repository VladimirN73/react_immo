import * as React from "react";

export interface IRequestFormProps {}

export interface IBodyState {
  home?: boolean;
}

export default class BodyElement extends React.Component<IRequestFormProps, IBodyState> {
  constructor(props: IRequestFormProps) {
    super(props);
    this.state = {
      home: false,
    };
  }

  public componentDidMount(): void {}

  public render() {
    return <div>Body</div>;
  }
}
