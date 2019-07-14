import React, { Component } from 'react';
import {
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Input,
  Form,
  FormGroup
} from 'reactstrap';
import logo from './media/logo.svg';
import './Header.css';

class Header extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }

  toggle() {
    this.setState(
      {
        isOpen: !this.state.isOpen
      }
    );
  }

  render() {
    return (
      <div className="Header" >
        <Navbar color="dark" dark expand="md">
          <NavbarBrand>
            <Form inline>
              <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                <img src={logo} className="logo mr-sm-2" alt="logo" />
                <Input defaultValue="Nuevo Proyecto" id="project-name"/>
              </FormGroup>
            </Form>
          </NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink href="/#">Components</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/#">GitHub</NavLink>
              </NavItem>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  Options
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem>
                    Option 1
                  </DropdownItem>
                  <DropdownItem>
                    Option 2
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem>
                    Reset
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}
export default Header;