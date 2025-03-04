import {Platform, StyleSheet, Dimensions} from 'react-native';


const {width, height} = Dimensions.get('window');
const SCREEN_WIDTH = width < height ? width : height;
const numColumns = 2;

export const AppStyles = {

  fontSize: {
    title: 30,
    content: 20,
    normal: 16,
  },
  buttonWidth: {
    main: '80%',
  },
  textInputWidth: {
    main: '80%',
  },
  borderRadius: {
    main: 25,
    small: 5,
  },
};

export const AppIcon = {
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 8,
    marginRight: 10,
  },
  style: {
    tintColor: AppStyles.color.tint,
    width: 25,
    height: 25,
  },
};

export const HeaderButtonStyle = StyleSheet.create({
  multi: {
    flexDirection: 'row',
  },
  container: {
    padding: 10,
  },
  image: {
    justifyContent: 'center',
    width: 35,
    height: 35,
    margin: 6,
  },
  rightButton: {
    color: AppStyles.color.tint,
    marginRight: 10,
    fontWeight: 'normal',
  },
});

export const ListStyle = StyleSheet.create({
  title: {
    fontSize: 16,
    color: AppStyles.color.subtitle,
    fontWeight: 'bold',
  },
  subtitleView: {
    minHeight: 55,
    flexDirection: 'row',
    paddingTop: 5,
    marginLeft: 10,
  },
  leftSubtitle: {
    flex: 2,
  },
  avatarStyle: {
    height: 80,
    width: 80,
  },
});

export const ButtonStyle = {
  btnFilled: {
    marginVertical: '10%',
    paddingHorizontal: 55,
    paddingVertical: 12,
    backgroundColor: AppStyles.color.main,
    borderRadius: 22,
    alignSelf: 'center',
  },
  btntransparent: {
    margin: '5%',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    borderColor: '#8B50B2',
    borderWidth: 2,
    alignSelf: 'center',
    flex: 1,
  },
  btnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
  btnStatus: {
    paddingHorizontal: 30,
    paddingVertical: 2,
    backgroundColor: AppStyles.color.main,
    borderRadius: 3,
    color: AppStyles.color.white,
    fontSize: 11,
  },
};

export const Common = {
  logo: {
    alignSelf: 'center',
    marginVertical: '5%',
    width: '20%',
    height: '15%',
  },
  ncwText: {
    // marginTop: '5%',
    textAlign: 'center',
    fontSize: 24,
    color: '#8B50B2',
    fontWeight: 'bold',
    fontFamily: 'Raleway',
    lineHeight: 32,
  },
  infoText: {
    marginTop: '3%',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '400',
    color: '#2B2B2B',
    alignSelf: 'center',
  },
  errorText: {
    marginTop: '5%',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.darkGrey,
    alignSelf: 'center',
  },
  surveyTitle: {
    color: COLORS.purple,
    fontSize: 18,
    fontWeight: '600',
    marginVertical: '2%',
    textAlign: 'center',
  },
  surveySubTitle: {
    color: COLORS.purple,
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'center',
  },
};
