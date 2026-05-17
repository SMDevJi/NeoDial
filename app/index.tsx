import {
  ActivityIndicator,
  Image,
  Pressable,
  SectionList,
  Text,
  View,
} from "react-native";

import { useCallback, useState } from "react";
import { Link, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants/images";
import CallRecordCard from "@/components/CallRecordCard";

import {
  readCallLogs,
  requestAllPermissions,
} from "@/lib/CallLogUtil";

export default function Index() {

  const [allLogs, setAllLogs] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(200);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);




  function groupCallLogs(logs: any[]) {

    if (!logs || logs.length === 0) {
      return [];
    }

    const grouped: any = {};

    const now = new Date();

    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const startOfYesterday = new Date(
      startOfToday
    );

    startOfYesterday.setDate(
      startOfYesterday.getDate() - 1
    );






    logs.forEach((log) => {

      const logDate = new Date(
        Number(log.timestamp)
      );

      let sectionTitle = "";

      if (logDate >= startOfToday) {

        sectionTitle = "Today";

      } else if (
        logDate >= startOfYesterday
      ) {

        sectionTitle = "Yesterday";

      } else {

        sectionTitle =
          logDate.toLocaleDateString(
            "en-US",
            {
              day: "numeric",
              month: "long",
              year: "numeric",
            }
          );
      }

      if (!grouped[sectionTitle]) {

        grouped[sectionTitle] = [];

      }

      grouped[sectionTitle].push(log);

    });






    return Object.entries(grouped).map(
      ([title, data]) => ({
        title,
        data,
      })
    );
  }



  async function loadLogs() {

    try {
      setLoading(true);
      setError(false);
      const permission = await requestAllPermissions();

      if (!permission) {
        setError(true);
        return;
      }


      const logs = await readCallLogs();
      setAllLogs(logs);

      const firstBatch = logs.slice(0, 200);
      const grouped = groupCallLogs(firstBatch);
      setSections(grouped);
    } catch (e) {
      console.log(e);
      setError(true);
    } finally {
      setLoading(false);
    }
  }










  function loadMoreLogs() {
    if (loadingMore) {
      return;
    }

    if (visibleCount >= allLogs.length) {
      return;
    }

    setLoadingMore(true);


    const newCount = visibleCount + 200;
    const nextLogs = allLogs.slice(0, newCount);
    const grouped = groupCallLogs(nextLogs);


    setVisibleCount(newCount);
    setSections(grouped);
    setLoadingMore(false);
  }







  useFocusEffect(
    useCallback(() => {
      loadLogs();
    }, [])
  );








  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
          <Text className="text-xl font-semibold text-text-secondary mb-5">
            Loading Call Logs...
          </Text>

          <ActivityIndicator
            size="large"
            color="#2E7D32"
          />
        </View>
      </SafeAreaView>
    );
  }







  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center px-5">
          <Text className="text-2xl font-bold text-red-500">
            Failed To Load Logs
          </Text>
          <Text className="text-center text-text-secondary mt-3">
            Please allow permissions and try again.
          </Text>
        </View>
      </SafeAreaView>
    );
  }






  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-5 bg-white">

        <View className="flex-row justify-between items-center mt-5">
          <Text className="text-3xl font-semibold">
            Call Logs
          </Text>

          <View className="flex-row gap-5">
            <Image
              source={images.search}
              className="size-8"
            />
            <Image
              source={images.filter}
              className="size-8"
            />

          </View>
        </View>











        <View className="flex-row w-full justify-between items-center mt-7 h-16 rounded-md overflow-hidden">
          <View className="flex-row justify-center items-center w-1/2 h-full gap-1 bg-background-soft border-b-2 border-b-primary-dark">
            <Image
              source={images.manage}
              className="size-6"
              tintColor="#2E7D32"
            />
            <Text className="text-lg font-semibold text-primary-dark">
              Manage
            </Text>
          </View>


          <Link
            href="/backupRestore"
            className="w-1/2"
          >

            <View className="flex-row justify-center items-center w-full h-full gap-2 bg-background">
              <Image
                source={images.backup}
                className="size-6"
                tintColor="#757575"
              />
              <Text className="text-lg font-semibold text-text-secondary">
                Backup / Restore
              </Text>
            </View>
          </Link>
        </View>














        <SectionList
          sections={sections}
          keyExtractor={(item) =>
            item.id.toString()
          }


          renderItem={({ item }) => (
            <CallRecordCard
              log={item}
            />
          )}



          renderSectionHeader={({
            section,
          }) => (
            <Text className="font-bold text-lg mt-6 mb-4">
              {section.title}
            </Text>
          )}



          contentContainerStyle={{
            paddingTop: 20,
            paddingBottom: 120,
          }}



          showsVerticalScrollIndicator={false}

          onEndReached={loadMoreLogs}
          onEndReachedThreshold={0.5}

          initialNumToRender={15}
          maxToRenderPerBatch={10}
          windowSize={10}
          removeClippedSubviews={true}


          ListFooterComponent={
            loadingMore ? (
              <View className="py-5">
                <ActivityIndicator
                  size="small"
                  color="#2E7D32"
                />
              </View>
            ) : null
          }
        />






        <Link
          href="/addlog"
          asChild
        >
          <Pressable className="absolute bottom-12 right-10 bg-primary-dark w-16 h-16 rounded-full justify-center items-center">
            <Text className="text-white text-4xl font-light">
              +
            </Text>
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
}