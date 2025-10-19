import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)", // semi-transparent backdrop
  },
  modalView: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#2e7d32", // Agribuddy green tone
  },
  modalText: {
    fontSize: 15,
    color: "#333",
    marginBottom: 15,
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  modalButton: {
    backgroundColor: "#2e7d32",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "500",
    textAlign: "center",
  },



    buttonPrimary: {
    backgroundColor: "#607D8B",
    borderRadius: 10,
    paddingHorizontal:16,
    },
    buttonSecondary: {
    borderWidth: 1.5,
    borderColor: "#607D8B",
    borderRadius: 10,
    backgroundColor: "transparent",
    },

    buttonLabelPrimary: {
    color: "#fff",
    fontWeight: "600",
    },

    buttonLabelSecondary: {
    color: "#607D8B",
    fontWeight: "600",
    },

    dialogContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 5,
    elevation: 6,
    },

    dialogBodyText:{
        fontSize:16,
    }
});