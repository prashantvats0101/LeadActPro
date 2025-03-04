import { StyleSheet, Text, View, FlatList } from 'react-native'
import React from 'react'
import LeadCard from '../../components/LeadCards'
import LeadCardContact from '../../components/LeadCardContact';
import { FAB, Provider as PaperProvider } from 'react-native-paper';

const Lead = ({ navigation }) => {
    const data = [
        { id: '1', title: 'John Doe', subtitle: 'Software Engineer' },
        { id: '2', title: 'Jane Smith', subtitle: 'Product Manager' },
        { id: '3', title: 'Alice Brown', subtitle: 'UI/UX Designer' },
    ];
    const renderItem = ({ item }) => (
 
        <LeadCardContact
            title={item.title}
            subtitle={item.subtitle}
            oncardPress={() => navigation.navigate('ContactDetails')}
            onCallPress={() => handleCallPress(item.title)}
            onSmsPress={() => handleSmsPress(item.title)}
            onWhatsappPress={() => handleWhatsappPress(item.title)}
        />
    );

    const handleCallPress = () => {
        console.log('Call button pressed');
    };

    const handleSmsPress = () => {
        console.log('SMS button pressed');
    };

    const handleWhatsappPress = () => {
        console.log('WhatsApp button pressed');
    };
    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
            />
            <PaperProvider>
                <FAB
                    style={styles.fab}
                    icon="plus"
                    color='#ffffff'
                    //label="Add"
                    onPress={() => navigation.navigate('AddContact')}
                />
            </PaperProvider>
        </View>
    )
}

export default Lead

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    list: {
        padding: 10,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
        elevation: 4, // Shadow for Android
        shadowColor: '#000', // Shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    textContainer: {
        flex: 1,
        marginRight: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    subtitle: {
        fontSize: 14,
        color: '#777',
        marginTop: 4,
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    divider: {
        width: 1,
        height: 24,
        backgroundColor: '#ccc',
        marginHorizontal: 8,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: 'red',
        borderRadius: 50,
    },
});
