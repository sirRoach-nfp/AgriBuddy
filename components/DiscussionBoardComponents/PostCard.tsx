import { StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React from 'react'

import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import { Avatar } from 'react-native-paper';
import { router } from 'expo-router';
interface Props {
    Author:string,
    CreatedAt:any,
    Content:any,
    Id:any,
    Title:string,
    ReplyCount:any


}

const getAuthorInitials = (name:string) => {
    if (!name) return "";
    const words = name.trim().split(" ");
    return words.length > 1
      ? words[0][0] + words[1][0] // First letter of first and last name
      : words[0][0]; // If only one word, return the first letter
  };



const formatDate = (createdAt:any) => {
if (!createdAt || !createdAt.seconds) return "N/A"; // Handle missing data

const date = new Date(createdAt.seconds * 1000); // Convert Firestore timestamp to JS Date
return date.toLocaleDateString("en-US", { month: "long", day: "numeric" }); // Format as "Month Day"
};


const navigateToPost = (RefId:string) =>{

    const queryString= `?PostRefId=${encodeURIComponent(RefId)}`
    //router.push(`/(sc)${queryString}` as any)

    router.push(`/(screens)/DisussionScreen${queryString}` as any)
}


const PostCard = ({Author,CreatedAt,Content,Id,Title,ReplyCount}:Props) => {
  return (
    <TouchableOpacity style={styles.wrapperMain} onPress={()=>navigateToPost(Id)}>
      <View style={styles.infoContainer}>

        <View style={styles.titleContainer}>


            <Avatar.Text size={24} label={getAuthorInitials(Author)}  style={styles.badgeContainer}/>
            <Text style={styles.titleTextUsername}>{Author}</Text>
            <Text style={styles.titleTextDate}>{formatDate(CreatedAt)}</Text>
        </View>

        <View style={styles.contentContainer}>
            <Text  style={styles.contentText} numberOfLines={3} ellipsizeMode="tail">{Title}</Text>
        </View>
           
        <View style={styles.commentContainer}>

            
            <FontAwesome5 name="comment-alt" size={13} color="black" />
            <Text style={{marginLeft:5,fontSize:15,fontWeight:600}}>{ReplyCount}</Text>
        </View>

      </View>

    </TouchableOpacity>
  )
}

export default PostCard

const styles = StyleSheet.create({

    badgeContainer:{
        width:30,
        height:30,
        borderRadius:'50%',
        //borderWidth:1,
        marginRight:10
    },

    wrapperMain:{
        width:'100%',
        //borderWidth:1,
        //maxHeight:110,
        display:'flex',
        flexDirection:'row',
        padding:15,
        backgroundColor:'#CFFFDC',
        borderRadius:5,
        marginBottom:10

    },

    infoContainer:{
        flex:1,
        //borderWidth:1,
        display:'flex',
        flexDirection:'column',

    },

    thumbnailContainer:{
        width:130,
        height:90,
        borderWidth:1,
        marginLeft:10
    },
    titleContainer:{
        //borderWidth:1,
        width:'100%',
        paddingVertical:5,
        display:'flex',
        flexDirection:'row',
        alignItems:'center'

    },
    contentContainer:{
        //borderWidth:1,
        width:'100%',
        paddingVertical:15
    },
    commentContainer:{
        alignSelf:'flex-start',
        borderRadius:10,
        borderWidth:1,
        paddingVertical:5,
        paddingHorizontal:10,
        marginTop:'auto',
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
    },

    //text

    titleTextUsername:{
        fontWeight:700,
        fontSize:15,
        
    },
    contentText:{
        fontSize:16,
        fontWeight:400
    },
    titleTextDate:{
        fontSize:15,
        marginLeft:10        
    }
})