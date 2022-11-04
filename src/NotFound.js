import React, { Component } from 'react';
import $, {jQuery} from 'jquery';
import './App.css';
import Header from './Components/Header';
import Footer from './Components/Footer';


class NotFound extends Component {

  constructor(props){
    super(props);
    this.state = {
      resumeData: {}
    };

  }

  getResumeData(){
    $.ajax({
      url:'/resumeData.json',
      dataType:'json',
      cache: true,
      success: function(data){
        this.setState({resumeData: data});
      }.bind(this),
      error: function(xhr, status, err){
        console.log(err);
        alert(err);
      }
    });
  }

    componentDidMount() {
        this.getResumeData();
    }

  render() {
    return (
      <div className="NotFound">
        <Header data={this.state.resumeData.main}/>
        <Footer data={this.state.resumeData.main}/>
      </div>
    );
  }
}

export default NotFound;
