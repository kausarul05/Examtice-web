import React from "react";
import { Route, Redirect } from "react-router-dom";
import Cookies from "js-cookie";

const AffiliateRoute = ({
    isAffiliate,
  component: Component,
  ...rest
}) => {

const IsAffiliateRole = [5, 6];

  return (
    <Route
      {...rest}
      render={props =>
        Cookies.get("token") && Cookies.get("user_data") && IsAffiliateRole.includes(isAffiliate) ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: props.location }
            }}
          />
        )
      }
    />

  );
};

export default AffiliateRoute;

