import { Text, View, StyleSheet, TextInput, TouchableOpacity, ScrollView, StatusBar } from "react-native";
import { ThemeContext } from "@/context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useContext, useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
export default function EditScreen() {

    const { id } = useLocalSearchParams();
    const [todo, setTodo] = useState({});
    const {colorScheme, setColorScheme, theme} = useContext(ThemeContext);
    const router = useRouter();
    useEffect(()=>{
        const fetchData = async () => {
            try{
                const jsonValue = await AsyncStorage.getItem('TodoApp')
                const storageTodos = jsonValue != null ? JSON.parse(jsonValue) : null
                if(storageTodos && storageTodos.length){
                setTodo(storageTodos.find(item => item.id.toString() === id))
                }
            }catch(e)
            {
                console.error(e)
            }
        }

        fetchData()
    },[id]);

    const styles = createStyles(theme, colorScheme);
    const handleSave = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('TodoApp');

            const storageTodos = jsonValue != null ? JSON.parse(jsonValue) : null

            if(storageTodos && storageTodos.length){
                const otherTodos = storageTodos.filter(item => item.id !== todo.id);
                const allTodos = [...otherTodos, todo]
                await AsyncStorage.setItem('TodoApp', JSON.stringify(allTodos));
            }
            else{
                await AsyncStorage.setItem('TodoApp', JSON.stringify([todo]));
            }

            router.push('/');
        }
        catch(e){
            console.error(e)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.editContainer}>
                <TextInput 
                placeholder={todo.title}
                value={todo.title}
                onChangeText={(text) => setTodo((prev)=> ({...prev, title: text}))}
                style={styles.inputText}/>
                <TouchableOpacity onPress={handleSave} style={styles.okButton}>
                    <Text style={styles.buttonText}>Ok</Text>
                </TouchableOpacity>    
            </View>
            <TouchableOpacity onPress={()=>router.push('/')} style={styles.cancelButton}>
                <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <StatusBar style={colorScheme === "dark" ? 'light' : 'dark'} />
        </SafeAreaView>
    )
}

function createStyles(theme,colorScheme) {
    return StyleSheet.create({
        container: {
            flex: 1,
            width: '100%',
            maxWidth: 600,
            backgroundColor: theme.backgroundColor,
            paddingHorizontal: 10,
            justifyContent: 'center'
        },
        editContainer: {
            flexDirection: "row",
            marginTop: 10,
            marginBottom: 10,
        },
        inputText: {
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
        okButton: {
            height: 50,
            backgroundColor: theme.okButton,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: theme.okButton,
            borderRadius: 10,
            padding: 14,
        },
        buttonText: {
            color: theme.buttonText,
            fontFamily: 'Montserrat_500Medium',
        },
        cancelButton: {
            height: 50,
            backgroundColor: theme.cancelButton,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: theme.cancelButton,
            borderRadius: 10,
            padding: 14,
        }
    })
}