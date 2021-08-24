import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Vibration}  from "react-native";
import {Countdown} from './../../components/Countdown';
import {RoundedButton} from './../../components/RoundedButton';
import { ProgressBar } from "react-native-paper";
import { Audio } from "expo-av";
import { useKeepAwake } from "expo-keep-awake";
import { Timing } from "./timing";

export const Timer = ({focusSubject, clearSubject, onTimerEnd}) => {
  useKeepAwake();

  const soundObject = new Audio.Sound();

  const [minutes, setMinutes] = useState(0.1);
  const [isStarted, setStarted]= useState(false);
  const [pauseCounter, setPauseCounter] = useState(0);
  const [progress, setProgress] = useState(1);

  const onProgress = (p) => {
    setProgress(p / 100);
  };

  const onPause = () => {
    setPauseCounter(pauseCounter + 1);
  };

  const onEnd = async () => {
    try {
      await soundObject.loadAsync(require("../../../assets/bell.mp3"));
      await soundObject.playAsync();
      const interval = setInterval(() => Vibration.vibrate(5000), 1000);
      setTimeout(() => {
        clearInterval(interval);
      }, 10000);
    } catch (error) {
      console.log(error);
    }
    setProgress(1);
    setStarted(false);
    setMinutes(20);
    onTimerEnd();
  };

  const changeTime = (min) => () => {
    setProgress(1);
    setStarted(false);
    setMinutes(min);
  };

  return (
    <View style = {styles.container}>
      <View style = {styles.countdown}>
        <Countdown 
          minutes={minutes}
          isPaused={!isStarted}
          onPause={onPause}
          onEnd={onEnd}
          onProgress={onProgress}/>
      </View>
      <View style={{padding: 50}}>
        <Text style={styles.title}> Focusing on:  </Text>
        <Text style={styles.task}>  {focusSubject} </Text>
      </View>
      <View>
        <ProgressBar
          progress={progress}
          color='#5E84E2'
          style={{height:10}}
        />
      </View>

      <View style={styles.buttonWrapper}>
        <Timing changeTime={changeTime} />
      </View>

      <View style={styles.buttonWrapper}>      
        { !isStarted ? (
            <RoundedButton title="start" onPress={() => setStarted(true)} />
          ) : (
            <RoundedButton title="paused" onPress={() => setStarted(false)} />    
          )
        }
      </View>
      <View style={styles.clearSubject}>
        <RoundedButton title="-" size={50} onPress={() => clearSubject()} />
      </View>
    </View> 
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#252250",
    flex: 1,
  },  
  title: {
    color: "white", textAlign: "center" 
  },
  task: {
     color: "white", fontWeight: "bold", textAlign: "center"
  },
  countdown: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
 buttonWrapper: {
    flex: 0.3,
    padding: 15,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center"    
  },  
  clearSubject: {
    paddingBottom: 25,
    paddingLeft: 25,
  }
});