/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/self-closing-comp */
/* eslint-disable max-len */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
/* eslint-disable import/extensions */
/* eslint-disable no-else-return */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import $ from 'jquery';
import GalleryMain from './GalleryMain.jsx';
import GalleryDetail from './GalleryDetail.jsx';
import SharePopupInner from './SharePopupInner.jsx';
import GalleryDetailGrid from './GalleryDetailGrid.jsx';
import '../styles/App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: [],
      view: 'main',
      showSharePopup: false,
    };
    this.renderView = this.renderView.bind(this);
    this.onShowAll = this.onShowAll.bind(this);
    this.onExitDetail = this.onExitDetail.bind(this);
    this.saveToList = this.saveToList.bind(this);
    this.sharePopupHandler = this.sharePopupHandler.bind(this);
    this.backToGalleryDetail = this.backToGalleryDetail.bind(this);
    this.onClickDetailHandler = this.onClickDetailHandler.bind(this);
  }

  componentDidMount() {
    $.ajax({
      method: 'GET',
      url: '/api/0/photogallery',
      success: (data) => {
        console.log(data);
        this.setState({ photos: data });
      },
      error: (err) => {
        console.log('err on ajax get: ', err);
      },
    });
  }

  onShowAll() {
    this.setState({ view: 'showAll' });
  }

  onExitDetail() {
    console.log('app close');
    this.setState({ view: 'main' });
  }

  onClickDetailHandler() {
    this.setState({
      showSharePopup: false,
    });
  }

  backToGalleryDetail() {
    this.setState({
      showSharePopup: false,
      view: 'showAll',
    });
  }

  sharePopupHandler() {
    this.setState({
      showSharePopup: !this.state.showSharePopup,
    });
  }

  saveToList(name) {
    $.ajax({
      method: 'POST',
      url: '/api/0/photogallery',
      data: {
        name,
      },
      success: () => {
        console.log('successfully save to a list ajax');
      },
      error: (err) => {
        console.log('err on ajax save to list post: ', err);
      },
    });
  }

  renderView() {
    const { view } = this.state;
    const mainPhoto = [];
    const list = this.state.photos;
    const mql = window.matchMedia('(max-width: 1100px)');
    if (list.length !== 0) {
      for (let i = 0; i < 5; i += 1) {
        mainPhoto.push(list[0].room_photos[i]);
      }
      if (view === 'main') {
        console.log('main!!');
        return <GalleryMain photos={this.state.photos[0]} onShowAll={this.onShowAll} sharePopupHandler={this.sharePopupHandler} onExitDetail={this.onExitDetail} />;
      } else if (view === 'showAll') {
        if (mql.matches) {
          return <GalleryDetailGrid photos={this.state.photos[0]} onExitDetail={this.onExitDetail} />;
        } else {
          return <GalleryDetail photos={this.state.photos[0]} onExitDetail={this.onExitDetail} sharePopupHandler={this.sharePopupHandler} />;
        }
      } else {
        return null;
      }
    }
    return null;
  }

  render() {
    const sharePopupBackground = this.state.showSharePopup ? 'showShareBackground' : 'noShareBackground';
    return (
      <div>
        {this.renderView()}
        <div className={sharePopupBackground} onClick={this.onClickDetailHandler}></div>
        {this.state.showSharePopup ? <SharePopupInner backToGalleryDetail={this.backToGalleryDetail} /> : null}
      </div>
    );
  }
}

export default App;
