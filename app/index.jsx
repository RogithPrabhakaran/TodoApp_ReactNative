import { Text, View, StyleSheet, TextInput, TouchableOpacity, ScrollView, StatusBar } from "react-native";
import { ThemeContext } from "@/context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { LinearTransition } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useContext, useEffect } from "react";
import { Data } from "../data/todo";
import { useRouter } from "expo-router";
export default function Index() {

  const [text, setText] = useState("");
  const [data, setData] = useState([]);
  const {colorScheme, setColorScheme, theme} = useContext(ThemeContext);
  const router = useRouter();
  const handleAdd = () => {
    if(text!==''){
      const newItem = {
      id: data.length>0? data[0].id + 1 : 1,
      title: text,
      completed: false,
    };  
    setData([newItem,...data]);
    setText("");
    }
  };

  const handlePress = (id) => {
    router.push(`/todos/${id}`)
  }
  const handleComplete = (id) => {
    const updatedData = data.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
      
    );
    setData(updatedData);
  };
  const handleTrash = (id) => {
    const newData = data.filter(item => 
      item.id !== id
    );
    setData(newData);
  }
  
  useEffect(()=>{
    const fetchData = async () => {
      try{
        const jsonValue = await AsyncStorage.getItem("TodoApp")
        const storageTodos = jsonValue != null ? JSON.parse(jsonValue) : null

        if(storageTodos){
          setData(storageTodos.sort((a,b)=>b.id - a.id))
        }
        else{
          setData(Data.sort((a,b)=>b.id - a.id))
        }
      }catch(e){
        console.error(e)
      }
    }

    fetchData()
  },[Data])

  useEffect(()=>{
    const storeData = async () => {
      try{
        const jsonValue = JSON.stringify(data);
        await AsyncStorage.setItem("TodoApp", jsonValue);
      }catch(e){
        console.error(e)
      }
    }

    storeData()
  },[data])


  const styles = createStyles(theme, colorScheme);
  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.input}>
        <TextInput 
        value={text}
        onChangeText={setText}
        placeholder="Add a new todo"
        placeholderTextColor={theme.text}
        style={styles.inputBox}/>
        <TouchableOpacity onPress={handleAdd} style={styles.button}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=> setColorScheme(colorScheme === "dark" ? "light" : "dark")} style={{marginLeft: 10, marginTop:10,}}>
            <MaterialIcons name = {colorScheme === "dark" ? "dark-mode" : "light-mode"} size={30} color={theme.text}/>
        </TouchableOpacity>
      </View>

        <Animated.FlatList
        data={data}
        keyExtractor={(item)=>item.id.toString()}
        ListEmptyComponent={<Text style={{color: theme.text}}>No Items.</Text>}
        renderItem={({item})=>(
          <View style={styles.row}>
            <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}>
            <Text style={[styles.text, {textDecorationLine: item.completed ? 'line-through' : 'none'}, item.completed && {color:theme.secondaryText}]} numberOfLines={1} onPress={()=>handleComplete(item.id)} onLongPress={() => handlePress(item.id)}>{item.title}</Text>
            </ScrollView>
            <TouchableOpacity style={styles.iconContainer} onPress={()=>handleTrash(item.id)}>
                <MaterialIcons  name="delete" size={30} color={theme.text} />
            </TouchableOpacity>
          </View>
        )}
        itemLayoutAnimation={LinearTransition}
        keyboardDismissMode="on-drag"/>

        <StatusBar style={colorScheme === "dark" ? "light" : "dark"}/>
    </SafeAreaView>
  );
}


function createStyles(theme, colorScheme){
  return StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingHorizontal:10,
    backgroundColor: theme.backgroundColor
  },
  input: {
    flexDirection: "row",
    marginTop: 20,
    width: "100%",
    maxWidth: 600,
    marginBottom:10,
  },
  inputBox: {
    height: 50,
    padding: 14,
    color: theme.text,
    fontFamily: 'Montserrat_500Medium',
    borderWidth: 1,
    borderColor: theme.borderColor,
    borderRadius: 10,
    marginRight: 5,
    flex: 1,  
  },
  button: {
    height: 50,
    backgroundColor: theme.buttonBackground,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.borderColor,
    borderRadius: 10,
    padding: 14,
  },
  buttonText: {
    color: theme.buttonText,
    fontFamily: 'Montserrat_500Medium',
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 50,
    borderBottomWidth: 1,
    borderColor: theme.borderColor,
    marginBottom: 10,
    alignItems: "center",
  },
  text: {
    color: theme.text,
    paddingLeft: 10,
    flex: 1,
    fontFamily: 'Montserrat_500Medium',
  },
  iconContainer: {
    paddingHorizontal: 10,
  }
});
}