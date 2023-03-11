const { registryPromise } = require("./contracts");

const isPartner = async (address) => {
  const registry = await registryPromise();
  const partner = await registry.memberInfos(address);
  if (partner) {
    return true;
  }
  return false;
};

const getPartner = async (address) => {
  const registry = await registryPromise();
  const partner = await registry.memberInfos(address);
  return Object.fromEntries(
    Object.entries(partner).filter(([key]) => !/^\d+$/.test(key))
  );
};

const getPartnerList = async () => {
  const registry = await registryPromise();
  const n = await registry.getMemberCount();
  let partners = [];
  for (let i = 0; i < n; i += 1) {
    partners.push(registry.memberAddresses(i));
  }
  partners = await Promise.all(partners);
  const info = await Promise.all(
    partners.map((address) => registry.memberInfos(address))
  );
  for (let i = 0; i < n; i += 1) {
    info[i] = Object.fromEntries(
      Object.entries(info[i]).filter(([key]) => !/^\d+$/.test(key))
    );
    info[i].address = partners[i];
  }
  return info;
};

const findPartnerByName = async (university, department) => {
  const partners = await getPartnerList();
  const partner = partners.filter(
    (p) => p.university === university && p.department === department
  )[0];
  return partner;
};

module.exports = { findPartnerByName, isPartner, getPartner, getPartnerList };
