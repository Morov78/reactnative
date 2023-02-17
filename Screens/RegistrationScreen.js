import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
} from "react-native";

import * as ImagePicker from "expo-image-picker";

import { useFonts } from "expo-font";
import { useRef, useState } from "react";

const initUser = {
  image: null,
  name: "",
  email: "",
  password: "",
};

export default function RegistrationScreen() {
  const [fontsLoaded] = useFonts({
    "Roboto-Medium": require("../assets/fonts/Roboto-Medium.ttf"),
    "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
  });
  const [user, setUser] = useState(initUser);
  const [isHiddenPassword, setIsHiddenPassword] = useState(true);
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [isFocused, setIsFocused] = useState(null);

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  if (!fontsLoaded) {
    return null;
  }

  const onSubmit = () => {
    console.log("USER_DATA:", user);

    setUser(initUser);
    setIsFocused(null);
  };

  const visibleKeyboard = (element) => {
    setIsFocused(element);
    setIsShowKeyboard(true);
  };

  const hideKeyboard = () => {
    setIsFocused(null);
    setIsShowKeyboard(false);

    Keyboard.dismiss();
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setUser((prevState) => ({ ...prevState, image: result.assets[0].uri }));
    }
  };

  const removeImage = () => {
    setUser((prevState) => ({ ...prevState, image: null }));
  };

  return (
    <TouchableWithoutFeedback onPress={hideKeyboard}>
      <View style={styles.section}>
        <View style={styles.form}>
          <KeyboardAvoidingView
            enabled={false}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={styles.wrap}>
              <View style={styles.avatar}>
                {user.image && (
                  <Image
                    source={{ uri: user.image }}
                    style={styles.avatarImage}
                  />
                )}

                {user.image ? (
                  <TouchableOpacity
                    style={styles.addIcon}
                    onPress={removeImage}
                  >
                    <Image
                      source={require("../assets/images/removeIcon.png")}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.addIcon} onPress={pickImage}>
                    <Image source={require("../assets/images/addIcon.png")} />
                  </TouchableOpacity>
                )}
              </View>

              <Text style={styles.title}>Регістрація</Text>

              <TextInput
                style={[
                  styles.wrapInput,
                  isFocused === "name" ? styles.activeInput : null,
                ]}
                ref={nameRef}
                placeholder="Логін"
                placeholderTextColor="#BDBDBD"
                value={user.name}
                onFocus={() => visibleKeyboard("name")}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => emailRef.current.focus()}
                onChangeText={(value) =>
                  setUser((prevState) => ({ ...prevState, name: value }))
                }
              />

              <TextInput
                style={[
                  styles.wrapInput,
                  isFocused === "email" ? styles.activeInput : null,
                ]}
                ref={emailRef}
                keyboardType="email-address"
                placeholder="Адреса електронної пошти"
                placeholderTextColor="#BDBDBD"
                value={user.email}
                onFocus={() => visibleKeyboard("email")}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => passwordRef.current.focus()}
                onChangeText={(value) =>
                  setUser((prevState) => ({ ...prevState, email: value }))
                }
              />

              <View
                style={{
                  marginBottom: isShowKeyboard ? 32 : 43,
                }}
              >
                <TextInput
                  style={[
                    styles.wrapInput,
                    isFocused === "password" ? styles.activeInput : null,
                    { paddingRight: 108 },
                  ]}
                  ref={passwordRef}
                  secureTextEntry={isHiddenPassword}
                  placeholder="Пароль"
                  placeholderTextColor="#BDBDBD"
                  value={user.password}
                  onFocus={() => visibleKeyboard("password")}
                  onSubmitEditing={hideKeyboard}
                  onChangeText={(value) =>
                    setUser((prevState) => ({ ...prevState, password: value }))
                  }
                />

                <TouchableOpacity style={styles.btnIsVisible}>
                  <Text
                    style={styles.text}
                    onPress={() =>
                      setIsHiddenPassword((prevState) => !prevState)
                    }
                  >
                    Показати
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>

          {!isShowKeyboard && (
            <View style={styles.wrap}>
              <TouchableOpacity style={styles.btn}>
                <Text
                  style={{ ...styles.text, color: "#FFFFFF" }}
                  onPress={onSubmit}
                >
                  Зареєструватися
                </Text>
              </TouchableOpacity>

              <Text style={styles.text}>Вже є аккаунт? Логін</Text>
              <View style={styles.line}></View>
            </View>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  section: {
    flex: 1,
    justifyContent: "flex-end",
  },
  form: {
    position: "relative",
    paddingTop: 92,
    paddingBottom: 8,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: "#FFFFFF",
  },
  avatar: {
    position: "absolute",
    top: -150,
    left: "50%",
    marginLeft: -60,
    width: 120,
    height: 120,
    borderRadius: 16,
    backgroundColor: "#F6F6F6",
  },
  avatarImage: {
    height: 125,
    width: 125,
    borderRadius: 16,
  },
  addIcon: {
    position: "absolute",
    width: 25,
    height: 25,
    right: -12,
    bottom: 26,
  },
  wrap: {
    marginHorizontal: 16,
  },
  title: {
    marginBottom: 32,
    fontFamily: "Roboto-Medium",
    fontSize: 30,
    lineHeight: 35,
    letterSpacing: 0.16,
    textAlign: "center",
    color: "#212121",
  },
  wrapInput: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: "#F6F6F6",
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 8,
    color: "#212121",
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    lineHeight: 18.75,
  },
  activeInput: {
    borderColor: "#FF6C00",
    backgroundColor: "#FFFFFF",
  },
  btn: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    marginBottom: 16,
    backgroundColor: "#FF6C00",
    borderRadius: 100,
  },

  btnIsVisible: {
    position: "absolute",
    content: "",
    right: 16,
    top: 20,
  },

  text: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    lineHeight: 18.75,
    color: "#1B4371",
    textAlign: "center",
  },

  line: {
    marginTop: 66,
    width: 134,
    height: 5,
    backgroundColor: "#212121",
    borderRadius: 100,
    alignSelf: "center",
  },
});
