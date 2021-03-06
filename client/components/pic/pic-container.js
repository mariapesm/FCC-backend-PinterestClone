"use strict";

import React from "react";
import { connect } from "react-redux";

import { modeSwitch } from "../../actions/mode-actions";
import { picUpdate, picDelete } from "../../actions/pics-actions";
import { Pic } from "./pic.jsx";
import {
  picDeleteDb,
  picUpdateDb
} from "../../actions/utils";

const mapStateToProps = stateProps => ({
  ...stateProps
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { dispatch } = dispatchProps;
  return ({
    ...stateProps,
    ...ownProps,

    selectUserHandler: () => { // ◄---------------------------------------------
      dispatch(modeSwitch(ownProps.pic.owner._id));
    },

    likeHandler: () => { // ◄---------------------------------------------------
      let _pic = Object.assign({}, ownProps.pic),
          index = _pic.likes.indexOf(stateProps.user._id);
      if (index === -1) {
        _pic.likes.push(stateProps.user._id);
      } else {
        _pic.likes.splice(index, 1)
      }
      picUpdateDb(_pic)
      .then(result => {
        if (result.message === "pic updated") {
          dispatch(picUpdate(_pic))
        } else if (result.message === "auth error") {
          delete localStorage.user;
          dispatch ({type: "USER_SIGNOUT_SUCCESS" });
        }
      })
    },

    delHandler: () => { // ◄----------------------------------------------------
      if (ownProps.pic.owner._id === stateProps.user._id) {
        picDeleteDb(ownProps.pic)
        .then(result => {
          if (result.message === "pic deleted") {
            dispatch(picDelete(ownProps.pic))
          } else if (result.message === "auth error") {
            delete localStorage.user;
            dispatch ({type: "USER_SIGNOUT_SUCCESS" });
          }
        })
      }
    }

  })
};

export default connect(mapStateToProps, null, mergeProps)(Pic)

