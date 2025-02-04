import { Text, View } from 'react-native';
import { globalStyle } from '../../styles/GlobalStyle';

export default function LoadingView() {
    return (
        <View style={globalStyle.innerContainer}>
            <Text style={globalStyle.subTitle}>Loading...</Text>
          </View>
    );
}