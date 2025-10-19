import { ActivityIndicator, FlatList, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from '@expo/vector-icons/Ionicons'
import { router } from 'expo-router'
import { Searchbar } from 'react-native-paper'
import { collection, doc, getDoc, getDocs, orderBy, query, QueryDocumentSnapshot, where } from 'firebase/firestore'
import { db } from '../firebaseconfig'
import { LinearGradient } from 'expo-linear-gradient'
import { useSearchParams } from 'expo-router/build/hooks'

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import PostCard from '@/components/DiscussionBoardComponents/PostCard'
import { useLanguage } from '../Context/LanguageContex';
interface DiscussionData {
    DocumentId:string,
    Author:string,
    Content:string,
    CreatedAt:any,
    Title:string,
    ReplyCount:any,
    Tag:string,
    AuthorName:string
  }
  


const DiscussionSearchResult = () => {
    const {language} = useLanguage()
    const [discussionData, setDiscussionData] = useState<DiscussionData[]>([]);
    const searchParams = useSearchParams();
    const [loadingResult, setLoadingResult] = useState(false);

    const queryString = searchParams.get('searchQuery');

    const preprocessSearch = (text: string): string[] => {
        return text
            .toLowerCase()
            .replace(/[^\w\s]/gi, '')
            .split(/\s+/)
            .filter((word, index, self) => word.length > 1 && self.indexOf(word) === index);
    };

    useEffect(() => {
        const searchDiscussion = async (searchText: string) => {
            setLoadingResult(true);
            try {
                const keywords = preprocessSearch(searchText).slice(0, 10);
                if (keywords.length === 0) {
                    setDiscussionData([]);
                    setLoadingResult(false);
                    return;
                }

                const discussionRef = query(
                    collection(db, "Discussions"),
                    where("Keyword", "array-contains-any", keywords),
                    orderBy("CreatedAt", "desc")
                );

                const snapshot = await getDocs(discussionRef);
                const docs = snapshot.docs as QueryDocumentSnapshot<DiscussionData>[];

                const discussions = await Promise.all(
                    docs.map(async (docSnap) => {
                        const repliesRef = collection(db, "Discussions", docSnap.id, "Comments");
                        const repliesSnap = await getDocs(repliesRef);

                        return {
                            DocumentId: docSnap.id,
                            Author: docSnap.data().Author,
                            Content: docSnap.data().Content,
                            CreatedAt: docSnap.data().CreatedAt,
                            Title: docSnap.data().Title,
                            ReplyCount: repliesSnap.size,
                            Tag: docSnap.data().Tag,
                        };
                    })
                );

                const authorIds = [...new Set(discussions.map((d) => d.Author))];
                const userDocs = await Promise.all(
                    authorIds.map(async (uid) => {
                        const userSnap = await getDoc(doc(db, "Users", uid));
                        return userSnap.exists()
                            ? { uid, Username: userSnap.data().Username }
                            : { uid, Username: "Unknown" };
                    })
                );

                const userMap = userDocs.reduce<Record<string, string>>((acc, u) => {
                    acc[u.uid] = u.Username;
                    return acc;
                }, {});

                const discussionsWithNames = discussions.map((d) => ({
                    ...d,
                    AuthorName: userMap[d.Author] || "Unknown",
                }));

                setDiscussionData(discussionsWithNames);
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingResult(false);
            }
        };

        if (queryString) searchDiscussion(queryString);
    }, [queryString]);

    const renderItem = ({ item }: { item: DiscussionData & { AuthorName: string } }) => (
        <PostCard
            Tag={item.Tag}
            AuthorName={item.AuthorName}
            Author={item.Author}
            CreatedAt={item.CreatedAt}
            Content={item.Content}
            Id={item.DocumentId}
            Title={item.Title}
            ReplyCount={item.ReplyCount}
        />
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F4F5F7' }}>
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    style={{ alignSelf: 'flex-start', marginLeft: 10,borderWidth:0, }}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={30} color="#607D8B" />
                </TouchableOpacity>

                <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{ fontSize: 18, fontWeight: 600, color: '#37474F', marginLeft: 10 }}
                >
                    "{queryString}"
                </Text>
            </View>

            {loadingResult ? (
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <ActivityIndicator size={75} color="#607D8B" />
                </View>
            ) : (
                <FlatList
                    data={discussionData}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.DocumentId}
                    contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: discussionData.length === 0 ? 'center' : 'flex-start',
                        alignItems: 'center',
                        paddingVertical: 10,
                        borderWidth:0,
                        paddingHorizontal:10,
                    }}
                    ListEmptyComponent={
                        <View style={{ alignItems: 'center' }}>
                            <MaterialIcons name="search-off" size={75} color="#607D8B" />
                            <Text style={{ fontSize: 25, fontWeight: 600, color: '#37474F' }}>
                     
                                {language === "en" ? "No Result Found" : "Walang natagpuang resulta"}
                            </Text>
                            <Text style={{textAlign:'center' ,fontSize: 16, fontWeight: 400, color: '#333333' }}>
                                
                                {language === "en" ? "We can't find any discussion matching your search" : "Hindi namin makita ang anumang talakayan na akma sa iyong search."}
                            </Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
};


export default DiscussionSearchResult

const styles = StyleSheet.create({
    
    headerContainer:{
        width:'100%',
        paddingVertical:12,
        borderBottomWidth:1,
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
      
        //backgroundColor:'#2E6F40',
        //marginBottom:20,
        backgroundColor:'white',
        borderColor:'#E2e8f0'
    },

    scrollContainer:{
        display:'flex',
        width:'100%',
        flexDirection:'column',
        //backgroundColor:'red',
       //flex:1,
        //borderWidth:1,
        paddingTop:10,
        paddingHorizontal:10,
    }
})