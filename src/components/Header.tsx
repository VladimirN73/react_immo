import * as React from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";

export interface IRequestFormProps {}

export interface IHeaderState {
  home?: boolean;
}

class HeaderElement extends React.Component<IRequestFormProps, IHeaderState> {
  constructor(props: IRequestFormProps) {
    super(props);
    this.state = {
      home: false,
    };
  }

  public componentDidMount(): void {}

  public render() {
    return (
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="#home">Immo v 0.0.8</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#link">Link</Nav.Link>
              <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
}

export default HeaderElement;
