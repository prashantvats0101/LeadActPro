import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
  FlatList
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import TransparentButton from "./../../components/TransparentButton";
import NotesCard from "./../../components/NotesComponents";
import { _get } from "../../api/apiClient";

const LeadInterested = ({navigation, route}) => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [project_name, setProject_Name] = useState("");
  const [property_type, setProperty_Type] = useState("");
  const [property_stage, setProperty_Stage] = useState("");
  const [alternative_no, setAlternative_No] = useState("");
  const [budget, setbudget] = useState("");
  const[data, setData] = useState([]);
  const[leadSource,setLeadSource] = useState('')
  const { item,screen } = route.params;
  console.log("itemidddddd in leadddddddddddd", screen);

  useEffect(() => {
    getLeadView();
  }, []);

  const getLeadView = async () => {
      try {
        const response = await _get(`/leadview/${item?.id}`).then(response => {
          
          // Destructure `data` from the Axios response
          let obj = [];
          for (let key in response.data) {
            if (key == 'statushistory') {
              let res = response.data[key].map(it => {
                obj.push({
                  followup: it.Followup_on,
                  notes: it.notes,
                  status: it.status,
                  substatus: it.substatus,
                });
                // obj.id = it.id;
                // obj.value = it.id;
                return;
              });
              setData(obj);
            }
          }
  
          const {data} = response;
          console.log("response in leadintrested",data)
          // Further destructure the `name` property from `data`
          const {
            name,
            email,
            mobile,
            city,
            project_name,
            property_type,
            property_stage,
            alternative_no,
            budget_name,
            lead_source
          } = data.data; // Assuming the response format
          setName(name);
          setEmail(email);
          setMobile(mobile);
          setCity(city);
          setProject_Name(project_name);
          setProperty_Type(property_type);
          setProperty_Stage(property_stage);
          setAlternative_No(alternative_no);
          setbudget(budget_name);
          setLeadSource(lead_source)
        });
      } catch (error) {
        console.error('API Error:sss', error);
      }
    };

  const handleCallPress = () => {
    Linking.openURL(`tel:${mobile}`)
      .then((supported) => {
        if (!supported) {
          Alert.alert("Phone number is not available");
        } else {
          return Linking.openURL(mobile);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleSmsPress = () => {
    const url = `sms:${mobile}`; // Using the "sms:" protocol
    Linking.openURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url); // Open the default messaging app
        } else {
          Alert.alert("Error", "Unable to open the messaging app.");
        }
      })
      .catch((err) => console.error("Error opening messaging app:", err));
  };

  const handleWhatsappPress = () => {
    const url = `https://wa.me/${mobile}`; // WhatsApp URL scheme

    Linking.openURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url); // Open WhatsApp with the specified phone number
        } else {
          Alert.alert("Error", "WhatsApp is not installed on your device.");
        }
      })
      .catch((err) => console.error("Error opening WhatsApp:", err));
  };

  const renderItem = ({item}) => (
      <View style={styles.card}>
        {/* Content Section */}
        <View style={styles.content}>
          {/* Left Section */}
          <View style={styles.column}>
            <Text style={styles.value}>
              Status:{' '}
              <Text style={{color: '#000', fontSize: 14, right: 40}}>
                {item.status ? item.status : '-'}
              </Text>
            </Text>
            <Text style={styles.createdAt}>
              Created At:{' '}
              <Text style={{color: '#000', fontSize: 14}}>
                {item.followup ? item.followup : new Date().toLocaleDateString()}
              </Text>
            </Text>
          </View>
  
          {/* Vertical Divider */}
          <View style={styles.divider} />
  
          {/* Right Section */}
          <View style={styles.column}>
            <Text style={styles.value}>
              SubStatus:{' '}
              <Text style={{color: '#000', fontSize: 14}}>
                {item.substatus ? item.substatus : '-'}
              </Text>
            </Text>
          </View>
        </View>
        <Text style={styles.value1}>
          Notes:{' '}
          <Text style={{color: '#000', fontSize: 14}}>
            {item?.notes ? item?.notes : '-'}
          </Text>
        </Text>
      </View>
    );
  
    const renderEmptyComponent = () => (
      <Text style={styles.noDataText}>No Data Found</Text>
    );

  return (
    <ScrollView>
      <View style={styles.uppersection}>
        <View style={styles.leftSection}>
          <View>
            <Text style={styles.title}>{name ? name : "-"}</Text>
            <Text style={styles.subtitle}>CALL BACK</Text>
          </View>
          {/* <TouchableOpacity style={styles.editButton}>
            <MaterialIcons name="edit" size={23} color="gray" />
          </TouchableOpacity> */}
        </View>

        {/* Right Section */}
        <View style={styles.rightSection}>
          <TouchableOpacity style={styles.iconButton} onPress={handleCallPress}>
            <MaterialCommunityIcons name="phone" size={24} color="lightgreen" />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.iconButton} onPress={handleSmsPress}>
            <MaterialCommunityIcons
              name="message-text"
              size={24}
              color="blue"
            />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleWhatsappPress}
          >
            <MaterialCommunityIcons name="whatsapp" size={24} color="green" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.card}>
        {/* Content Section */}
        <View style={styles.content}>
          {/* Left Section */}
          <View style={styles.column}>
            {/* <Text style={styles.text}>Location:</Text> */}
            {/* <Text style={styles.valuetext}>-</Text> */}
            {/* <Text style={styles.text}>Country:</Text>
            <Text style={styles.valuetext}>{city ? city : "-"}</Text> */}
            {/* <Text style={styles.text}>State:</Text> */}
            {/* <Text style={styles.valuetext}>-</Text> */}
            <Text style={styles.text}>City:</Text>
            <Text style={styles.valuetext}>{city ? city : "-"}</Text>
            <Text style={styles.text}>Property Stage:</Text>
            <Text style={styles.valuetext}>
              {property_stage ? property_stage : "-"}
            </Text>
            <Text style={styles.text}>Property Sub Type:</Text>
            <Text style={styles.valuetext}></Text>
            <Text style={styles.text}>Project:</Text>
            <Text style={styles.valuetext}>
              {project_name ? project_name : "-"}
            </Text>
          </View>

          {/* Vertical Divider */}
          <View style={styles.divider} />

          {/* Right Section */}
          <View style={styles.column}>
            <Text style={styles.textright}>Contact Number:</Text>
            <Text style={styles.valuetext1}>{mobile ? mobile : "-"}</Text>
            <Text style={styles.textright}>Budget:</Text>
            <Text style={styles.valuetext1}>{budget ? budget : "-"}</Text>
            <Text style={styles.textright}>Propety Type:</Text>
            <Text style={styles.valuetext1}>
              {property_type ? property_type : "-"}
            </Text>
            <Text style={styles.textright}>Lead Source:</Text>
            <Text style={styles.valuetext1}>{leadSource ? leadSource : "-"}</Text>
          </View>
        </View>

        {/* Buttons Section */}
        <View style={styles.buttonRow}>
          <TransparentButton
            text="Create"
            borderColor="green"
            textColor="green"
            onPress={() => navigation.navigate("CreateTask", {item:item,
              screen:screen
            })}
          />
          <TransparentButton
            text="Reschedule"
            borderColor="#239999"
            textColor="#239999"
            onPress={() => navigation.navigate("RescheduleTask", {item:item})}
          />
          <TransparentButton
            text="Won"
            borderColor="red"
            textColor="red"
            onPress={() => navigation.navigate("WonDetails", {item:item})}
          />
          <TransparentButton
            text="Lost"
            borderColor="blue"
            textColor="blue"
            onPress={() => navigation.navigate("LostDetails", {item:item})}
          />
        </View>
      </View>
      <Text style={styles.titlenotes}>Activites</Text>
            <FlatList
              scrollEnabled={false}
              data={data}
              keyExtractor={(item, index) => item.id || index.toString()}
              renderItem={renderItem}
              ListEmptyComponent={renderEmptyComponent}
            />
      <Text style={styles.titlenotes}>Notes</Text>
      <NotesCard />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flexDirection: "row",
    marginBottom: 15,
  },
  column: {
    flex: 1,
    //justifyContent: "center",
    //alignItems: "center",
    paddingHorizontal: 8,
  },
  divider: {
    width: 1,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 8,
  },
  text: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  buttonRow: {
    //flexDirection: "row",
    //justifyContent: "space-between",
    //marginTop: 66,
  },
  button: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  uppersection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 16,
    //marginVertical: 10,
    //padding: 16,
    //borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    //backgroundColor: "#fff",
  },
  leftSection: {
    flexDirection: "row",
    //alignItems: "center",
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    color: "green",
  },
  titlenotes: {
    fontSize: 17,
    fontWeight: "bold",
    color: "green",
    paddingLeft: 16,
  },
  subtitle: {
    fontSize: 14,
    color: "gray",
    marginTop: 5,
  },
  editButton: {
    marginLeft: 10,
    marginBottom: 20,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginLeft: 15,
  },
  textright: {
    fontSize: 16,
    color: "#333",
    paddingLeft: 20,
  },
  valuetext: {
    fontSize: 14,
    color: "#333",
    fontWeight: "bold",
    //textAlign: "center",
    marginVertical: 2,
    marginBottom: 4,
  },
  valuetext1: {
    fontSize: 14,
    color: "#333",
    fontWeight: "bold",
    //textAlign: "center",
    marginVertical: 2,
    marginBottom: 4,
    paddingLeft: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  text: {
    fontSize: 16,
    color: "#333",

    //
  },
  title1: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
    color: '#0389ca',
  },
  value1: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
    color: '#0389ca',
    paddingHorizontal: 10,
  },
});

export default LeadInterested;
