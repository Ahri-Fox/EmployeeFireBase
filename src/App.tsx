import React from 'react';
import Login from './page/login/Login';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Loading from './components/loading/Loading';
import HomeTemplate from './templates/HomeTemplate';
import Register from './page/register/Register';
import EmployeeTemplate from './templates/EmployeeTemplate';
import ListEmployee from './page/employee/ListEmployee';
import ProfileUser from './page/profile/ProfileUser';
import AddEmployee from './page/employee/AddEmployee';
import UpdateEmployee from './page/employee/UpdateEmployee';
import "leaflet/dist/leaflet.css";
const App: React.FC = () => {


  return (
    <BrowserRouter>
      <Loading />
      <Switch>
        <HomeTemplate exact path="/" WrappedComponent={Login} />
        <HomeTemplate exact path="/login" WrappedComponent={Login} />
        <HomeTemplate exact path="/register" WrappedComponent={Register} />


        <EmployeeTemplate exact path="/listEmployee" WrappedComponent={ListEmployee} />
        <EmployeeTemplate exact path="/listEmployee/addemployee" WrappedComponent={AddEmployee} />
        <EmployeeTemplate exact path="/listEmployee/updateemployee/:id" WrappedComponent={UpdateEmployee} />

        <Route exact path='/Profile/:id' component={ProfileUser} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
