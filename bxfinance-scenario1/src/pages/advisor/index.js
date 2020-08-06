// Packages
import React from 'react';
import {
  Button, Jumbotron, Row, Col, Card, CardBody,
  Collapse,
  Container,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink,
  Media,
  Table,
  CustomInput
} from 'reactstrap';
import { Link, NavLink as RRNavLink, useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedinIn, faFacebookF, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';

// Components
import NavbarMain from '../../components/NavbarMain';
import FooterMain from '../../components/FooterMain';
import AccountsSubnav from '../../components/AccountsSubnav';
import Session from '../../components/Utils/Session'; /* PING INTEGRATION: */

// Data
import data from '../../data/advisor.json';

// Styles
import '../../styles/pages/advisor.scss';

// Autocomplete Suggestion List
const SuggestionsList = props => {
  const {
    suggestions,
    inputValue,
    onSelectSuggestion,
    displaySuggestions,
    selectedSuggestion
  } = props;

  if (inputValue && displaySuggestions) {
    if (suggestions.length > 0) {
      return (
        <ul className="suggestions-list">
          {suggestions.map((suggestion, index) => {
            const isSelected = selectedSuggestion === index;
            const classname = `suggestion ${isSelected ? "selected" : ""}`;
            return (
              <li
                key={index}
                className={classname}
                onClick={() => onSelectSuggestion(index)}
              >
                {suggestion}
              </li>
            );
          })}
        </ul>
      );
    } else {
      return <ul className="suggestions-list"><li className="suggestion">No suggestions available...</li></ul>;
    }
  }
  return <div></div>;
};

// Search Autocomplete
const SearchAutocomplete = () => {
  const history = useHistory();
  const [inputValue, setInputValue] = React.useState("");
  const [filteredSuggestions, setFilteredSuggestions] = React.useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = React.useState(0);
  const [displaySuggestions, setDisplaySuggestions] = React.useState(false);
  const onChange = event => {
    const value = event.target.value;
    setInputValue(value);
    const filteredSuggestions = data.clients.suggestions.filter(suggestion =>
      suggestion.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredSuggestions(filteredSuggestions);
    setDisplaySuggestions(true);
  };
  const onSelectSuggestion = index => {
    setSelectedSuggestion(index);
    setInputValue(filteredSuggestions[index]);
    setFilteredSuggestions([]);
    setDisplaySuggestions(false);
    // go to client
    history.push("/advisor/client");
  };
  return (
    <div>
      <form className="form-search form-inline float-right">
        <input className="form-control user-input" type="text" placeholder={data.clients.search_placeholder} onChange={onChange} value={inputValue} />
        <SuggestionsList
          inputValue={inputValue}
          selectedSuggestion={selectedSuggestion}
          onSelectSuggestion={onSelectSuggestion}
          displaySuggestions={displaySuggestions}
          suggestions={filteredSuggestions}
        />
        <img src={process.env.PUBLIC_URL + "/images/icons/search.svg"} className="img-search" />
      </form>
    </div>
  );
};

// Advisor Page
class Advisor extends React.Component {
  constructor() {
    super();
    this.Session = new Session(); /* PING INTEGRATION: */
  }
  
  render() {
    return (
      <div className="accounts advisor">
        <NavbarMain data={data} />
        <section className="welcome-bar">
          <Container>
            <Row>
              <Col lg="12">
                <p>{data.welcome_bar}{this.Session.getAuthenticatedUserItem("firstName")}</p>
              </Col>
            </Row>
          </Container>
        </section>
        <section className="section-content">
          <Container>
            <Row>
              <Col lg="4">
                <h5>{data.profile.advisor.title}</h5>
                <Card>
                  <CardBody>
                    <Media>
                      <Media left href="#">
                        <Media object src={process.env.PUBLIC_URL + "/images/anywealthadvisor-photo.png"} alt="Generic placeholder image" />
                      </Media>
                      <Media body>
                        {/* PING INTEGRATION */}
                        <strong>{this.Session.getAuthenticatedUserItem("firstName") + " " + this.Session.getAuthenticatedUserItem("lastName")}</strong>
                        <span dangerouslySetInnerHTML={{ __html: data.profile.advisor.content }}></span>
                        <Button color="link">{data.profile.advisor.button}</Button>
                      </Media>
                    </Media>
                  </CardBody>
                </Card>
                <h5 className="mt-5">{data.alerts.title}</h5>
                <Card className="mb-5">
                  <CardBody>
                    {
                      Object.keys(data.alerts.messages).map(key => {
                        return (
                          <p key={key} dangerouslySetInnerHTML={{__html: data.alerts.messages[key]}}></p>
                        );
                      })      
                    }
                    <Button color="link">{data.alerts.button}</Button>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="8">
                <div>
                  <Row>
                    <Col lg="4">
                      <h5 className="mb-4">
                        {data.clients.title}
                        <div class="form-inline float-right">
                          <select class="form-control form-control-select">
                            <option>Filters</option>
                          </select>
                        </div>
                      </h5>
                    </Col>
                    <Col lg="8">
                      <SearchAutocomplete />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Card className="mt-3 mb-5">
                        <Table striped className="table-client">
                          <thead>
                            <tr>
                              <th className="pl-4">Name</th>
                              <th className="text-center">Active</th>
                              <th className="text-center">Last Contacted</th>
                              <th className="text-center">Total Portfolio</th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.table_data.map((item, i) => {
                              var id = i++;
                              return (
                                <tr key={i}>
                                  <td className="text-info pl-4">{item.name}</td>
                                  <td className="text-center"><CustomInput type="checkbox" id={i} checked={item.active} /></td>
                                  <td className="text-center">{item.date_contacted}</td>
                                  <td className="text-center">{item.portfolio}</td>
                                  <td><a href="#"><small>Modify</small></a></td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </Table>
                      </Card>
                    </Col>
                  </Row>
                </div>
                <div>
                  <h5 className="mb-4">{data.news.title}</h5>
                  <Row>
                    <Col md="6" className="mb-4">
                      <h5>{data.news.webinar.title}</h5>
                      <p className="mb-2" dangerouslySetInnerHTML={{__html: data.news.webinar.content}}></p>
                      <Button color="link">{data.news.webinar.button}</Button>
                    </Col>
                    <Col md="6" className="mb-4">
                      <h5>{data.news.schedules.title}</h5>
                      <p className="mb-2" dangerouslySetInnerHTML={{__html: data.news.schedules.content}}></p>
                      <Button color="link">{data.news.schedules.button}</Button>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
        <FooterMain />
      </div>
    );
  }
}

export default Advisor;
