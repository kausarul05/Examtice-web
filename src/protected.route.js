import React from "react";
import { Route, Redirect } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  var isRole =
    !!Cookies.get("user_data") && JSON.parse(Cookies.get("user_data"));
  var affiliateRole = !!isRole && isRole.affiliate_role;
  const IsAffiliateRole = [];
  const IsLmsRole = [7, 8];

  return (
    <Route
      {...rest}
      render={(props) =>
        Cookies.get("token") &&
        Cookies.get("user_data") &&
        !IsAffiliateRole.includes(affiliateRole) ? (
          <Component {...props} />
        ) : (
          <>
            {IsAffiliateRole.includes(affiliateRole) ? (
              <Redirect
                to={{
                  pathname: "/affiliate/dashboard",
                  state: { from: props.location },
                }}
              />
            ) : (
              <>
              {IsLmsRole.includes(affiliateRole) ? (
                <Redirect
                
                  to={{
                    pathname: "/learningmanagement/dashboard",
                    state: { from: props.location },
                  }}
                />
              ):(
                <Redirect
                
                to={{
                  pathname: "/",
                  state: { from: props.location },
                }}
              />
              )}
              </>
            )}
          </>
        )
      }
    />
  );
};

export default ProtectedRoute;
