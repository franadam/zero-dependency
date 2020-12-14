import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

import {
  FaCalendarAlt,
  FaLink,
  FaMapMarkerAlt,
  FaImage,
  FaPen,
  FaFileAlt,
  FaUser,
} from 'react-icons/all';

import classes from './Home.module.css';

import { fetchUsers, deleteUserInfo, fetchPosts } from '../../store/actions';
import Collapsible from '../Collapsible/Collapsible';
import { Link } from 'react-router-dom';

export class UnconnectedHome extends Component {
  componentDidMount() {
    this.props.onFetchUsers();
    this.props.onFetchPosts();
  }

  count(posts, user) {
    posts.filter((p) => (p.userId = user.id)).length;
  }

  render() {
    const { users, posts, errors, onDeleteUser } = this.props;

    const colls = users
      ? users.map((user) => {
          const userPosts = posts.filter((p) => p.userId === user.id);
          const content = userPosts.map((p) => (
            <div
              key={`${p.id}_${uuidv4()}`}
              className={classes.collapsible__content}
            >
              {userPosts.length === 0 ? (
                <p>{user.name} has not written articles yet</p>
              ) : (
                <>
                  <FaFileAlt />
                  <p>{p.title}</p>
                </>
              )}
            </div>
          ));

          return (
            <Collapsible
              key={`${user.username}_${uuidv4()}`}
              name={user.name}
              post={userPosts.length}
              album={3}
              type="user"
              content={content}
              delete={() => onDeleteUser(user.id)}
            />
          );
        })
      : [];

    return (
      <div data-test="component-home" className={classes.main}>
        <div className={classes.wrapper}>
          <h1>Users</h1>
          {colls}
          <Link to={`users/add`} className={classes.add}>
            <FaUser />
          </Link>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  users: state.user.users,
  posts: state.post.posts,
  errors: state.error,
});

const mapDispatchToProps = (dispatch) => ({
  onFetchUsers: () => dispatch(fetchUsers()),
  onDeleteUser: (userID) => dispatch(deleteUserInfo(userID)),
  onFetchPosts: () => dispatch(fetchPosts()),
});

UnconnectedHome.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object),
  posts: PropTypes.arrayOf(PropTypes.object),
  errors: PropTypes.object,
  onFetchUsers: PropTypes.func,
  onDeleteUser: PropTypes.func,
  onFetchPosts: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(UnconnectedHome);
