import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import { Avatar } from 'react-native-paper';

interface Props {
    Author:string,
    CreatedAt:any,
    Content:any,
    Title:any


}


const PostCard = ({Author,CreatedAt,Content,Title}:Props) => {
  return (
    <View style={styles.wrapperMain}>
      <View style={styles.infoContainer}>

        <View style={styles.titleContainer}>


            <Avatar.Text size={24} label={Author}  style={styles.badgeContainer}/>
            <Text style={styles.titleTextUsername}>{Author}</Text>
            <Text style={styles.titleTextDate}>Feb 20</Text>
        </View>

        <View style={styles.contentContainer}>
            <Text  style={styles.contentText} numberOfLines={3} ellipsizeMode="tail">{Content}</Text>
        </View>
           
        <View style={styles.commentContainer}>

            
            <FontAwesome5 name="comment-alt" size={13} color="black" />
            <Text style={{marginLeft:5,fontSize:15,fontWeight:600}}>5</Text>
        </View>

      </View>

    </View>
  )
}

export default PostCard

const styles = StyleSheet.create({

    badgeContainer:{
        width:30,
        height:30,
        borderRadius:'50%',
        borderWidth:1,
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