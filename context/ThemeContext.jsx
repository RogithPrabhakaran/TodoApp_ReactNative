import { createContext, useState, useEffect } from "react";
import { Colors } from "../constants/Colors";
import { Appearance, View, Text } from "react-native";
export const ThemeContext = createContext({});

export const ThemeProvider = ({children}) => {
    const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());
    const theme = colorScheme === "dark" ? Colors.dark : Colors.light;

    useEffect(()=>{

        const subscription = Appearance.addChangeListener(({colorScheme}) => {
            setColorScheme(colorScheme)
        })

        return () => subscription.remove()

    },[])

    return (
        <ThemeContext.Provider value={{colorScheme, setColorScheme,  theme}}>
            {children}
        </ThemeContext.Provider>
    )
}