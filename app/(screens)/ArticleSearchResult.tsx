import { ActivityIndicator, FlatList, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from '@expo/vector-icons/Ionicons'
import { router } from 'expo-router'
import { Searchbar } from 'react-native-paper'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../firebaseconfig'
import { LinearGradient } from 'expo-linear-gradient'
import { useSearchParams } from 'expo-router/build/hooks'

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import ArticleCard from '@/components/genComponents/ArticleCard'
import { useLanguage } from '../Context/LanguageContex';
interface ArticleData {
    cover:string,
    title:string,
    articleId:string
  }


const ArticleSearchResult = () => {
  const {language} = useLanguage()
    const [articleData, setArticleData] = useState<ArticleData[]>([]);
    const [loadingResult, setLoadingResult] = useState(false);
    const searchParams = useSearchParams();

    const queryString = searchParams.get('searchQuery');

    const preprocessSearch = (text: string): string[] => {
        return text
            .toLowerCase()
            .replace(/[^\w\s]/gi, '')
            .split(/\s+/)
            .filter((word, index, self) => word.length > 1 && self.indexOf(word) === index);
    };

    useEffect(() => {
        const fetchArticles = async () => {
            if (!queryString) return;

            setLoadingResult(true);
            try {
                const keywords = preprocessSearch(queryString).slice(0, 10);

                const q = query(
                    collection(db, 'Articles'),
                    where("keywords", "array-contains-any", keywords)
                );

                const articleDocSnap = await getDocs(q);

                const rawData = articleDocSnap.docs.map((doc) => ({
                    cover: doc.data().cover,
                    title: doc.data().title,
                    articleId: doc.id,
                }));

                console.log("Fetched Article Data:", rawData);
                setArticleData(rawData);
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingResult(false);
            }
        };

        fetchArticles();
    }, [queryString]);

    const renderItem = ({ item }: { item: ArticleData }) => (
        <ArticleCard articleId={item.articleId} cover={item.cover} title={item.title} />
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F4F5F7'}}>
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    style={{ alignSelf: 'flex-start', marginLeft: 10 }}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={25} color="#607D8B" />
                </TouchableOpacity>

                <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{ marginLeft: 10, fontSize: 18, fontWeight: 500, color: '#37474F' }}
                >
                  "{queryString}"
                </Text>
            </View>

            {loadingResult ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size={75} color="#607D8B" />
                </View>
            ) : (
                <FlatList
                    data={articleData}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.articleId}
                    contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: articleData.length === 0 ? 'center' : 'flex-start',
                        paddingHorizontal:10,
                        paddingVertical: 10,
                        borderWidth:0,
                        width:'100%',
                    }}
                    ListEmptyComponent={
                        <View style={{ alignItems: 'center', marginTop: 0 }}>
                            <MaterialIcons name="search-off" size={75} color="#607D8B" />
                            <Text style={{ fontSize: 25, fontWeight: 600, color: "#37474F" }}>
                               {language === "en" ? "No Result Found" : "Walang natagpuang resulta"}
                            </Text>
                            <Text style={{textAlign:'center', fontSize: 16, fontWeight: 400, color: "#333333" }}>
                              {language === "en" ? "We can't find any article matching your search" : "Hindi namin makita ang anumang article na akma sa iyong search."}
                                
                            </Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
};

export default ArticleSearchResult;


const styles = StyleSheet.create({
    
    headerContainer:{
        width:'100%',
        
        borderBottomWidth:1,
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'white',
        paddingVertical:15,
        borderColor:'#E2E8F0'
        //backgroundColor:'#2E6F40',
        //marginBottom:20,

    },

    scrollContainer:{
        display:'flex',
        width:'95%',
        flexDirection:'column',

        flex:1,
        //borderWidth:1,
        paddingTop:20
    }
})